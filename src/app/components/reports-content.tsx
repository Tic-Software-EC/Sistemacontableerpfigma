import { useState } from "react";
import { BarChart3, Download, FileText, TrendingUp, DollarSign, Package, User, Calendar, Filter, X, ShoppingCart, Percent, Award, AlertTriangle } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";

type ReportType = 
  | "overview" 
  | "by-supplier" 
  | "by-product" 
  | "by-category" 
  | "pending-orders" 
  | "price-analysis"
  | "supplier-performance"
  | "payment-status";

export function ReportsContent() {
  const [selectedReport, setSelectedReport] = useState<ReportType>("overview");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "2026-01-01", end: "2026-02-18" });
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Datos de ejemplo para los reportes
  const monthlyPurchases = [
    { month: "Ago 2025", total: 12500, orders: 8 },
    { month: "Sep 2025", total: 18300, orders: 12 },
    { month: "Oct 2025", total: 15200, orders: 10 },
    { month: "Nov 2025", total: 22100, orders: 15 },
    { month: "Dic 2025", total: 28500, orders: 18 },
    { month: "Ene 2026", total: 19800, orders: 13 },
    { month: "Feb 2026", total: 24200, orders: 16 }
  ];

  const supplierData = [
    { name: "Distribuidora Nacional S.A.", total: 35250, orders: 15, percentage: 28, avgDelivery: 3 },
    { name: "Kreafast", total: 28400, orders: 12, percentage: 22, avgDelivery: 2 },
    { name: "Papelería Corporativa Ltda.", total: 22800, orders: 18, percentage: 18, avgDelivery: 4 },
    { name: "Distribuidora La Favorita C.A.", total: 18200, orders: 10, percentage: 14, avgDelivery: 5 },
    { name: "Industrial Supplies Corp.", total: 12500, orders: 8, percentage: 10, avgDelivery: 6 },
    { name: "Otros", total: 10350, orders: 9, percentage: 8, avgDelivery: 4 }
  ];

  const categoryData = [
    { name: "Tecnología", value: 45200, percentage: 35, color: "#E8692E" },
    { name: "Papelería", value: 28500, percentage: 22, color: "#3B82F6" },
    { name: "Muebles", value: 24800, percentage: 19, color: "#10B981" },
    { name: "Equipos", value: 18200, percentage: 14, color: "#F59E0B" },
    { name: "Consumibles", value: 8500, percentage: 7, color: "#8B5CF6" },
    { name: "Otros", value: 3800, percentage: 3, color: "#6B7280" }
  ];

  const topProducts = [
    { code: "PROD-001", name: "Laptop Dell Inspiron 15", quantity: 25, total: 16250, supplier: "Distribuidora Nacional S.A." },
    { code: "PROD-007", name: "Resma Papel Bond A4 75g", quantity: 500, total: 2250, supplier: "Papelería Corporativa Ltda." },
    { code: "PROD-006", name: "Silla Ergonómica Ejecutiva", quantity: 25, total: 4625, supplier: "Papelería Corporativa Ltda." },
    { code: "PROD-002", name: "Monitor LG 24 pulgadas", quantity: 30, total: 5400, supplier: "Distribuidora Nacional S.A." },
    { code: "PROD-009", name: "Escritorio Ejecutivo en L", quantity: 8, total: 2560, supplier: "Industrial Supplies Corp." }
  ];

  const pendingOrders = [
    { orderId: "OC-2026-001", supplier: "Distribuidora Nacional S.A.", total: 5392.00, daysOverdue: 0, status: "Pendiente" },
    { orderId: "OC-2026-002", supplier: "Kreafast", total: 2000.00, daysOverdue: 0, status: "Pendiente" },
    { orderId: "OC-2026-004", supplier: "Comercial Andina", total: 3832.00, daysOverdue: 20, status: "Vencida" }
  ];

  const priceEvolution = [
    { month: "Ago", laptop: 640, monitor: 175, silla: 175 },
    { month: "Sep", laptop: 645, monitor: 178, silla: 180 },
    { month: "Oct", laptop: 650, monitor: 180, silla: 182 },
    { month: "Nov", laptop: 650, monitor: 182, silla: 185 },
    { month: "Dic", laptop: 655, monitor: 185, silla: 185 },
    { month: "Ene", laptop: 650, monitor: 180, silla: 188 },
    { month: "Feb", laptop: 650, monitor: 180, silla: 185 }
  ];

  const paymentStatus = [
    { status: "Pagadas", value: 45, total: 48250, color: "#10B981" },
    { status: "Pendientes", value: 30, total: 32500, color: "#F59E0B" },
    { status: "Vencidas", value: 15, total: 16800, color: "#EF4444" },
    { status: "Parciales", value: 10, total: 10200, color: "#3B82F6" }
  ];

  const reportCards = [
    {
      id: "overview" as ReportType,
      title: "Resumen General",
      description: "Visión completa de compras del periodo",
      icon: BarChart3,
      color: "primary",
      bgColor: "bg-primary/20"
    },
    {
      id: "by-supplier" as ReportType,
      title: "Por Proveedor",
      description: "Análisis de compras por proveedor",
      icon: User,
      color: "blue-400",
      bgColor: "bg-blue-500/20"
    },
    {
      id: "by-product" as ReportType,
      title: "Productos Más Comprados",
      description: "Top de productos adquiridos",
      icon: Package,
      color: "green-400",
      bgColor: "bg-green-500/20"
    },
    {
      id: "by-category" as ReportType,
      title: "Por Categoría",
      description: "Distribución por categorías",
      icon: FileText,
      color: "purple-400",
      bgColor: "bg-purple-500/20"
    },
    {
      id: "pending-orders" as ReportType,
      title: "Órdenes Pendientes",
      description: "Estado de órdenes sin completar",
      icon: AlertTriangle,
      color: "yellow-400",
      bgColor: "bg-yellow-500/20"
    },
    {
      id: "price-analysis" as ReportType,
      title: "Análisis de Precios",
      description: "Evolución de precios en el tiempo",
      icon: TrendingUp,
      color: "orange-400",
      bgColor: "bg-orange-500/20"
    },
    {
      id: "supplier-performance" as ReportType,
      title: "Desempeño de Proveedores",
      description: "Métricas de cumplimiento",
      icon: Award,
      color: "pink-400",
      bgColor: "bg-pink-500/20"
    },
    {
      id: "payment-status" as ReportType,
      title: "Estado de Pagos",
      description: "Análisis de cuentas por pagar",
      icon: DollarSign,
      color: "cyan-400",
      bgColor: "bg-cyan-500/20"
    }
  ];

  const handleExport = (format: string) => {
    alert(`Exportando reporte en formato ${format.toUpperCase()}...`);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-secondary border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header estándar con diseño corporativo */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Reportes y Análisis
          </h2>
          <p className="text-gray-400 text-sm">
            Análisis detallado de compras y métricas del periodo
          </p>
        </div>

        {/* Botones de acción - Arriba a la derecha */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-medium flex items-center gap-2 border border-white/10"
          >
            <Filter className="w-5 h-5" />
            Filtros
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Exportar
          </button>
        </div>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Filtros de Reporte
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Fecha Inicio</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Fecha Fin</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Proveedor</label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
              >
                <option value="all">Todos</option>
                <option value="Distribuidora Nacional S.A.">Distribuidora Nacional S.A.</option>
                <option value="Kreafast">Kreafast</option>
                <option value="Papelería Corporativa Ltda.">Papelería Corporativa Ltda.</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Categoría</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
              >
                <option value="all">Todas</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Papelería">Papelería</option>
                <option value="Muebles">Muebles</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Grid de cards de reportes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportCards.map((card) => {
          const Icon = card.icon;
          const isActive = selectedReport === card.id;
          return (
            <button
              key={card.id}
              onClick={() => setSelectedReport(card.id)}
              className={`bg-white/5 border rounded-xl p-5 text-left transition-all hover:scale-105 ${
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-white/10 hover:bg-white/10"
              }`}
            >
              <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-6 h-6 text-${card.color}`} />
              </div>
              <h3 className="text-white font-semibold mb-1">{card.title}</h3>
              <p className="text-gray-400 text-sm">{card.description}</p>
            </button>
          );
        })}
      </div>

      {/* Contenido del reporte seleccionado */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        {/* Resumen General */}
        {selectedReport === "overview" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-xl">Resumen General de Compras</h3>
              <span className="text-gray-400 text-sm">01 Ene 2026 - 18 Feb 2026</span>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Total Comprado</p>
                    <p className="text-white font-bold text-xl">$127,500</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-400 text-xs mt-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12.5% vs mes anterior</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Órdenes</p>
                    <p className="text-white font-bold text-xl">92</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-400 text-xs mt-2">
                  <TrendingUp className="w-3 h-3" />
                  <span>+8 órdenes</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Proveedores</p>
                    <p className="text-white font-bold text-xl">18</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs mt-2">
                  <span>Activos</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <Percent className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Ticket Promedio</p>
                    <p className="text-white font-bold text-xl">$1,386</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs mt-2">
                  <span>Por orden</span>
                </div>
              </div>
            </div>

            {/* Gráfico de compras mensuales */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h4 className="text-white font-semibold mb-4">Evolución de Compras Mensuales</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyPurchases}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E8692E" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#E8692E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="total" stroke="#E8692E" fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Por Proveedor */}
        {selectedReport === "by-supplier" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-xl">Análisis por Proveedor</h3>
            </div>

            {/* Gráfico de barras */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h4 className="text-white font-semibold mb-4">Compras por Proveedor</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={supplierData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9CA3AF" angle={-15} textAnchor="end" height={100} />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" fill="#E8692E" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tabla detallada */}
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Proveedor</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase">Órdenes</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Total</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase">% Total</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase">Días Entrega</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {supplierData.map((supplier, index) => (
                      <tr key={index} className="hover:bg-white/[0.02]">
                        <td className="px-6 py-4 text-white font-medium">{supplier.name}</td>
                        <td className="px-6 py-4 text-center text-gray-300">{supplier.orders}</td>
                        <td className="px-6 py-4 text-right text-primary font-bold">${supplier.total.toLocaleString()}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/20 text-primary text-sm font-medium">
                            {supplier.percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-gray-300">{supplier.avgDelivery} días</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Productos Más Comprados */}
        {selectedReport === "by-product" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-xl">Top Productos Más Comprados</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {topProducts.map((product, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        <span className="text-primary font-bold text-lg">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{product.name}</p>
                        <p className="text-gray-400 text-sm font-mono">{product.code}</p>
                        <p className="text-gray-500 text-xs mt-1">{product.supplier}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold text-xl">${product.total.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">{product.quantity} unidades</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Por Categoría */}
        {selectedReport === "by-category" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-xl">Distribución por Categorías</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de pastel */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h4 className="text-white font-semibold mb-4">Distribución Visual</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Lista de categorías */}
              <div className="space-y-3">
                {categoryData.map((category, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: category.color }}></div>
                        <span className="text-white font-medium">{category.name}</span>
                      </div>
                      <span className="text-primary font-bold">${category.value.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${category.percentage}%`, backgroundColor: category.color }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">{category.percentage}% del total</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Órdenes Pendientes */}
        {selectedReport === "pending-orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-xl">Órdenes Pendientes de Pago</h3>
              <span className="text-red-400 font-bold text-xl">$11,224.00</span>
            </div>

            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Orden</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Proveedor</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Total</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase">Días Vencimiento</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {pendingOrders.map((order, index) => (
                      <tr key={index} className="hover:bg-white/[0.02]">
                        <td className="px-6 py-4 text-white font-mono font-bold">{order.orderId}</td>
                        <td className="px-6 py-4 text-gray-300">{order.supplier}</td>
                        <td className="px-6 py-4 text-right text-primary font-bold">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center">
                          {order.daysOverdue > 0 ? (
                            <span className="text-red-400 font-bold">{order.daysOverdue} días</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${
                            order.status === "Vencida" 
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Análisis de Precios */}
        {selectedReport === "price-analysis" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-xl">Evolución de Precios</h3>
            </div>

            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h4 className="text-white font-semibold mb-4">Tendencia de Precios - Productos Seleccionados</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceEvolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="laptop" stroke="#E8692E" strokeWidth={2} name="Laptop Dell" />
                  <Line type="monotone" dataKey="monitor" stroke="#3B82F6" strokeWidth={2} name="Monitor LG" />
                  <Line type="monotone" dataKey="silla" stroke="#10B981" strokeWidth={2} name="Silla Ergonómica" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <p className="text-gray-400 text-sm">Laptop Dell</p>
                </div>
                <p className="text-white font-bold text-xl">$650.00</p>
                <p className="text-gray-400 text-xs mt-1">Sin cambios</p>
              </div>

              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <p className="text-gray-400 text-sm">Monitor LG</p>
                </div>
                <p className="text-white font-bold text-xl">$180.00</p>
                <p className="text-gray-400 text-xs mt-1">Sin cambios</p>
              </div>

              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <p className="text-gray-400 text-sm">Silla Ergonómica</p>
                </div>
                <p className="text-white font-bold text-xl">$185.00</p>
                <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5.7% en 6 meses
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Desempeño de Proveedores */}
        {selectedReport === "supplier-performance" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-xl">Métricas de Desempeño</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {supplierData.slice(0, 5).map((supplier, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-white font-semibold">{supplier.name}</h4>
                      <p className="text-gray-400 text-sm">{supplier.orders} órdenes completadas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold text-lg">${supplier.total.toLocaleString()}</p>
                      <p className="text-gray-400 text-xs">{supplier.percentage}% del total</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">Tiempo Entrega</p>
                      <p className="text-white font-bold">{supplier.avgDelivery} días</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">Cumplimiento</p>
                      <p className="text-green-400 font-bold">
                        {supplier.avgDelivery <= 4 ? "98%" : "85%"}
                      </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-xs mb-1">Calificación</p>
                      <p className="text-yellow-400 font-bold">
                        {supplier.avgDelivery <= 3 ? "⭐ 5.0" : supplier.avgDelivery <= 5 ? "⭐ 4.5" : "⭐ 4.0"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado de Pagos */}
        {selectedReport === "payment-status" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-xl">Estado de Cuentas por Pagar</h3>
              <span className="text-white font-bold text-xl">Total: $107,750</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de pastel */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h4 className="text-white font-semibold mb-4">Distribución de Pagos</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, value }) => `${status} ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Desglose */}
              <div className="space-y-4">
                {paymentStatus.map((status, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: status.color }}></div>
                        <span className="text-white font-medium">{status.status}</span>
                      </div>
                      <span className="text-white font-bold text-lg">${status.total.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${status.value}%`, backgroundColor: status.color }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">{status.value}% del total</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}