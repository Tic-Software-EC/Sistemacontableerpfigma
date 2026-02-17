import { BarChart3, DollarSign, FileText, TrendingUp, Users } from "lucide-react";

export function Dashboard() {
  const stats = [
    {
      icon: DollarSign,
      label: "Ingresos Totales",
      value: "$124,500",
      change: "+12.5%",
      positive: true,
    },
    {
      icon: FileText,
      label: "Facturas Emitidas",
      value: "245",
      change: "+8.2%",
      positive: true,
    },
    {
      icon: Users,
      label: "Clientes Activos",
      value: "156",
      change: "+3.1%",
      positive: true,
    },
    {
      icon: TrendingUp,
      label: "Crecimiento",
      value: "18.4%",
      change: "+2.3%",
      positive: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-secondary tracking-tight">Dashboard</h1>
        <p className="text-sm font-light text-gray-500 mt-1">
          Resumen general de tu sistema ERP
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.positive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-light text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-secondary">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Secciones adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad Reciente */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-secondary mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            {[
              { action: "Nueva factura creada", time: "Hace 5 minutos", client: "Empresa ABC" },
              { action: "Pago recibido", time: "Hace 1 hora", client: "Cliente XYZ" },
              { action: "Cliente agregado", time: "Hace 2 horas", client: "Nuevo Cliente" },
              { action: "Reporte generado", time: "Hace 3 horas", client: "Sistema" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-normal text-secondary">{activity.action}</p>
                  <p className="text-xs font-light text-gray-500 mt-1">
                    {activity.client} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Ventas */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-secondary mb-4">Ventas del Mes</h2>
          <div className="flex items-end justify-between h-48 gap-2">
            {[40, 65, 45, 80, 55, 70, 90].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-lg transition-all hover:from-primary/90 hover:to-primary/40"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-xs font-light text-gray-500">
                  {["L", "M", "X", "J", "V", "S", "D"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-secondary mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: FileText, label: "Nueva Factura" },
            { icon: Users, label: "Nuevo Cliente" },
            { icon: BarChart3, label: "Ver Reportes" },
            { icon: DollarSign, label: "Registrar Pago" },
          ].map((item, index) => (
            <button
              key={index}
              className="flex flex-col items-center gap-3 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <item.icon className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
              <span className="text-sm font-normal text-gray-600 group-hover:text-secondary">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
