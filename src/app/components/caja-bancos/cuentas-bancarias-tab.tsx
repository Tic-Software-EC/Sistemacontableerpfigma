import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Building2,
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
  X,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

interface CuentasBancariasTabProps {
  theme: string;
  isLight: boolean;
}

interface CuentaBancaria {
  id: string;
  banco: string;
  tipoCuenta: "corriente" | "ahorros";
  numeroCuenta: string;
  titular: string;
  moneda: "USD" | "EUR";
  saldoActual: number;
  estado: "activa" | "inactiva";
  fechaApertura: string;
  sucursal: string;
  contactoBanco: string;
  telefonoBanco: string;
}

export function CuentasBancariasTab({ theme, isLight }: CuentasBancariasTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBanco, setSelectedBanco] = useState("todos");
  const [selectedEstado, setSelectedEstado] = useState("todos");
  const [showNuevaCuenta, setShowNuevaCuenta] = useState(false);
  const [showEditarCuenta, setShowEditarCuenta] = useState(false);
  const [showDetalleCuenta, setShowDetalleCuenta] = useState(false);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<CuentaBancaria | null>(null);

  const [nuevaCuenta, setNuevaCuenta] = useState({
    banco: "",
    tipoCuenta: "corriente" as "corriente" | "ahorros",
    numeroCuenta: "",
    titular: "Comercial del Pacífico S.A.",
    moneda: "USD" as "USD" | "EUR",
    saldoActual: 0,
    sucursal: "",
    contactoBanco: "",
    telefonoBanco: "",
  });

  const cuentas: CuentaBancaria[] = [
    {
      id: "1",
      banco: "Banco Pichincha",
      tipoCuenta: "corriente",
      numeroCuenta: "2100456789",
      titular: "Comercial del Pacífico S.A.",
      moneda: "USD",
      saldoActual: 125430.50,
      estado: "activa",
      fechaApertura: "15/01/2024",
      sucursal: "Matriz Guayaquil",
      contactoBanco: "Ing. Carlos Mendoza",
      telefonoBanco: "04-2345678",
    },
    {
      id: "2",
      banco: "Banco Guayaquil",
      tipoCuenta: "corriente",
      numeroCuenta: "0012345678",
      titular: "Comercial del Pacífico S.A.",
      moneda: "USD",
      saldoActual: 68950.25,
      estado: "activa",
      fechaApertura: "20/03/2024",
      sucursal: "Mall del Sol",
      contactoBanco: "Lcda. María Torres",
      telefonoBanco: "04-2987654",
    },
    {
      id: "3",
      banco: "Banco del Pacífico",
      tipoCuenta: "ahorros",
      numeroCuenta: "7654321098",
      titular: "Comercial del Pacífico S.A.",
      moneda: "USD",
      saldoActual: 45200.00,
      estado: "activa",
      fechaApertura: "10/06/2024",
      sucursal: "Urdesa Central",
      contactoBanco: "Ec. Roberto Silva",
      telefonoBanco: "04-2112233",
    },
    {
      id: "4",
      banco: "Banco Internacional",
      tipoCuenta: "corriente",
      numeroCuenta: "5001234567",
      titular: "Comercial del Pacífico S.A.",
      moneda: "USD",
      saldoActual: 0,
      estado: "inactiva",
      fechaApertura: "05/02/2023",
      sucursal: "Alborada",
      contactoBanco: "Ing. Patricia León",
      telefonoBanco: "04-2556677",
    },
  ];

  const handleCrearCuenta = () => {
    if (!nuevaCuenta.banco || !nuevaCuenta.numeroCuenta || !nuevaCuenta.sucursal) {
      toast.error("Campos incompletos", {
        description: "Por favor completa todos los campos obligatorios"
      });
      return;
    }

    toast.success("Cuenta bancaria creada", {
      description: `${nuevaCuenta.banco} - ${nuevaCuenta.numeroCuenta}`
    });
    setShowNuevaCuenta(false);
    resetForm();
  };

  const handleEditarCuenta = () => {
    if (!cuentaSeleccionada) return;

    toast.success("Cuenta actualizada", {
      description: `${cuentaSeleccionada.banco} - ${cuentaSeleccionada.numeroCuenta}`
    });
    setShowEditarCuenta(false);
    setCuentaSeleccionada(null);
  };

  const handleEliminarCuenta = (cuenta: CuentaBancaria) => {
    if (cuenta.saldoActual > 0) {
      toast.error("No se puede eliminar", {
        description: "La cuenta tiene saldo pendiente. Debe estar en $0.00"
      });
      return;
    }

    toast.success("Cuenta eliminada", {
      description: `${cuenta.banco} - ${cuenta.numeroCuenta}`
    });
  };

  const handleVerDetalle = (cuenta: CuentaBancaria) => {
    setCuentaSeleccionada(cuenta);
    setShowDetalleCuenta(true);
  };

  const handleEditarModal = (cuenta: CuentaBancaria) => {
    setCuentaSeleccionada(cuenta);
    setShowEditarCuenta(true);
  };

  const resetForm = () => {
    setNuevaCuenta({
      banco: "",
      tipoCuenta: "corriente",
      numeroCuenta: "",
      titular: "Comercial del Pacífico S.A.",
      moneda: "USD",
      saldoActual: 0,
      sucursal: "",
      contactoBanco: "",
      telefonoBanco: "",
    });
  };

  const cuentasFiltradas = cuentas.filter(cuenta => {
    const matchesSearch =
      cuenta.banco.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuenta.numeroCuenta.includes(searchTerm) ||
      cuenta.sucursal.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBanco = selectedBanco === "todos" || cuenta.banco === selectedBanco;
    const matchesEstado = selectedEstado === "todos" || cuenta.estado === selectedEstado;

    return matchesSearch && matchesBanco && matchesEstado;
  });

  const totalSaldo = cuentas
    .filter(c => c.estado === "activa")
    .reduce((sum, c) => sum + c.saldoActual, 0);

  return (
    <div className="space-y-4">
      {/* Resumen */}
      <div className={`border rounded-lg p-4 ${
        isLight ? "bg-gradient-to-br from-green-50 to-white border-green-200" : "bg-gradient-to-br from-green-500/10 to-secondary border-green-500/20"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                Saldo Total Disponible
              </p>
              <p className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                ${totalSaldo.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xs ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Cuentas Activas
            </p>
            <p className={`text-2xl font-bold text-primary`}>
              {cuentas.filter(c => c.estado === "activa").length}
            </p>
          </div>
        </div>
      </div>

      {/* Botón Nueva Cuenta */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowNuevaCuenta(true)}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Cuenta Bancaria
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar banco, cuenta, sucursal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-3 py-1.5 border rounded-lg text-sm ${
              isLight
                ? "bg-white border-gray-200 text-gray-900"
                : "bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            }`}
          />
        </div>

        <select
          value={selectedBanco}
          onChange={(e) => setSelectedBanco(e.target.value)}
          className={`px-3 py-1.5 border rounded-lg text-sm ${
            isLight
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-white/5 border-white/10 text-white"
          }`}
        >
          <option value="todos">Todos los Bancos</option>
          <option value="Banco Pichincha">Banco Pichincha</option>
          <option value="Banco Guayaquil">Banco Guayaquil</option>
          <option value="Banco del Pacífico">Banco del Pacífico</option>
          <option value="Banco Internacional">Banco Internacional</option>
        </select>

        <select
          value={selectedEstado}
          onChange={(e) => setSelectedEstado(e.target.value)}
          className={`px-3 py-1.5 border rounded-lg text-sm ${
            isLight
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-white/5 border-white/10 text-white"
          }`}
        >
          <option value="todos">Todos los Estados</option>
          <option value="activa">Activas</option>
          <option value="inactiva">Inactivas</option>
        </select>
      </div>

      {/* Tabla */}
      <div className={`border rounded-lg overflow-hidden ${
        isLight ? "bg-white border-gray-200" : "bg-secondary border-white/10"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Banco
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tipo / Número
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Titular
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sucursal
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Saldo Actual
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? "divide-gray-200" : "divide-white/5"}`}>
              {cuentasFiltradas.map((cuenta) => (
                <tr
                  key={cuenta.id}
                  className={`transition-colors ${
                    isLight ? "hover:bg-gray-50" : "hover:bg-white/5"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                          {cuenta.banco}
                        </p>
                        <p className="text-xs text-gray-400">
                          {cuenta.fechaApertura}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className={`text-sm font-mono font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        {cuenta.numeroCuenta}
                      </p>
                      <p className="text-xs text-gray-400">
                        {cuenta.tipoCuenta === "corriente" ? "Cuenta Corriente" : "Cuenta de Ahorros"}
                      </p>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {cuenta.titular}
                  </td>
                  <td className={`px-4 py-3 text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    {cuenta.sucursal}
                  </td>
                  <td className={`px-4 py-3 text-right text-sm font-bold ${
                    cuenta.saldoActual > 0 
                      ? "text-green-500" 
                      : isLight ? "text-gray-400" : "text-gray-500"
                  }`}>
                    ${cuenta.saldoActual.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {cuenta.estado === "activa" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-xs font-medium">
                        <XCircle className="w-3 h-3" />
                        Inactiva
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleVerDetalle(cuenta)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isLight
                            ? "hover:bg-blue-50 text-blue-600"
                            : "hover:bg-blue-500/10 text-blue-400"
                        }`}
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditarModal(cuenta)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isLight
                            ? "hover:bg-yellow-50 text-yellow-600"
                            : "hover:bg-yellow-500/10 text-yellow-400"
                        }`}
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEliminarCuenta(cuenta)}
                        disabled={cuenta.saldoActual > 0}
                        className={`p-1.5 rounded-lg transition-colors ${
                          cuenta.saldoActual > 0
                            ? "opacity-50 cursor-not-allowed text-gray-500"
                            : isLight
                            ? "hover:bg-red-50 text-red-600"
                            : "hover:bg-red-500/10 text-red-400"
                        }`}
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nueva Cuenta */}
      {showNuevaCuenta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-2xl w-full ${
            isLight ? "bg-white" : "bg-card"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Nueva Cuenta Bancaria
              </h3>
              <button
                onClick={() => setShowNuevaCuenta(false)}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Banco *
                  </label>
                  <select
                    value={nuevaCuenta.banco}
                    onChange={(e) => setNuevaCuenta({...nuevaCuenta, banco: e.target.value})}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="">Seleccionar banco</option>
                    <option value="Banco Pichincha">Banco Pichincha</option>
                    <option value="Banco Guayaquil">Banco Guayaquil</option>
                    <option value="Banco del Pacífico">Banco del Pacífico</option>
                    <option value="Banco Internacional">Banco Internacional</option>
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Tipo de Cuenta *
                  </label>
                  <select
                    value={nuevaCuenta.tipoCuenta}
                    onChange={(e) => setNuevaCuenta({...nuevaCuenta, tipoCuenta: e.target.value as "corriente" | "ahorros"})}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="corriente">Cuenta Corriente</option>
                    <option value="ahorros">Cuenta de Ahorros</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Número de Cuenta *
                  </label>
                  <input
                    type="text"
                    value={nuevaCuenta.numeroCuenta}
                    onChange={(e) => setNuevaCuenta({...nuevaCuenta, numeroCuenta: e.target.value})}
                    placeholder="0000000000"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Moneda *
                  </label>
                  <select
                    value={nuevaCuenta.moneda}
                    onChange={(e) => setNuevaCuenta({...nuevaCuenta, moneda: e.target.value as "USD" | "EUR"})}
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  >
                    <option value="USD">USD - Dólares</option>
                    <option value="EUR">EUR - Euros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Titular *
                </label>
                <input
                  type="text"
                  value={nuevaCuenta.titular}
                  onChange={(e) => setNuevaCuenta({...nuevaCuenta, titular: e.target.value})}
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Sucursal *
                </label>
                <input
                  type="text"
                  value={nuevaCuenta.sucursal}
                  onChange={(e) => setNuevaCuenta({...nuevaCuenta, sucursal: e.target.value})}
                  placeholder="Ej: Matriz Guayaquil"
                  className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                    isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Contacto del Banco
                  </label>
                  <input
                    type="text"
                    value={nuevaCuenta.contactoBanco}
                    onChange={(e) => setNuevaCuenta({...nuevaCuenta, contactoBanco: e.target.value})}
                    placeholder="Ej: Ing. Carlos Mendoza"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Teléfono del Banco
                  </label>
                  <input
                    type="text"
                    value={nuevaCuenta.telefonoBanco}
                    onChange={(e) => setNuevaCuenta({...nuevaCuenta, telefonoBanco: e.target.value})}
                    placeholder="04-0000000"
                    className={`w-full px-3 py-1.5 border rounded-lg text-sm ${
                      isLight ? "bg-white border-gray-200 text-gray-900" : "bg-white/5 border-white/10 text-white"
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowNuevaCuenta(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    isLight ? "border-gray-200 hover:bg-gray-50" : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCrearCuenta}
                  className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium"
                >
                  Crear Cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle Cuenta */}
      {showDetalleCuenta && cuentaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-lg p-6 max-w-2xl w-full ${
            isLight ? "bg-white" : "bg-card"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                Detalle de Cuenta Bancaria
              </h3>
              <button
                onClick={() => setShowDetalleCuenta(false)}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <Building2 className="w-8 h-8 text-primary" />
                  <div>
                    <p className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                      {cuentaSeleccionada.banco}
                    </p>
                    <p className="text-sm text-gray-400">
                      {cuentaSeleccionada.tipoCuenta === "corriente" ? "Cuenta Corriente" : "Cuenta de Ahorros"}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center justify-between pt-3 border-t ${
                  isLight ? "border-blue-300" : "border-blue-500/20"
                }`}>
                  <div>
                    <p className="text-xs text-gray-400">Número de Cuenta</p>
                    <p className={`text-lg font-mono font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {cuentaSeleccionada.numeroCuenta}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Saldo Actual</p>
                    <p className="text-2xl font-bold text-green-500">
                      ${cuentaSeleccionada.saldoActual.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Titular</p>
                  <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                    {cuentaSeleccionada.titular}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Moneda</p>
                  <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                    {cuentaSeleccionada.moneda}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Sucursal</p>
                  <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                    {cuentaSeleccionada.sucursal}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Fecha de Apertura</p>
                  <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                    {cuentaSeleccionada.fechaApertura}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Contacto</p>
                  <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                    {cuentaSeleccionada.contactoBanco}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Teléfono</p>
                  <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                    {cuentaSeleccionada.telefonoBanco}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDetalleCuenta(false)}
                  className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    isLight ? "border-gray-200 hover:bg-gray-50" : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
