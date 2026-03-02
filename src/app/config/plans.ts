// Configuración de planes del sistema TicSoftEc
export interface PlanConfig {
  name: string;
  displayName: string;
  maxUsers: number;
  maxBranches: number;
  maxCashRegisters: number;
  price: number;
  description: string;
  features: string[];
  annualDiscountPercent?: number;
}

export const PLAN_CONFIGS: Record<"free" | "standard" | "custom", PlanConfig> = {
  free: {
    name: "free",
    displayName: "Free",
    maxUsers: 1,
    maxBranches: 1,
    maxCashRegisters: 1,
    price: 0,
    description: "Plan gratuito para comenzar",
    features: [
      "1 Usuario",
      "1 Sucursal",
      "1 Caja",
      "Funcionalidades básicas",
      "Soporte por email"
    ],
    annualDiscountPercent: 0
  },
  standard: {
    name: "standard",
    displayName: "Standard",
    maxUsers: 10,
    maxBranches: 5,
    maxCashRegisters: 3,
    price: 99.00,
    description: "Plan ideal para pequeñas empresas",
    features: [
      "Hasta 10 Usuarios",
      "Hasta 5 Sucursales",
      "Hasta 3 Cajas",
      "Todas las funcionalidades",
      "Soporte prioritario"
    ],
    annualDiscountPercent: 15
  },
  custom: {
    name: "custom",
    displayName: "Custom",
    maxUsers: 50,
    maxBranches: 20,
    maxCashRegisters: 15,
    price: 299.00,
    description: "Plan personalizado para empresas grandes",
    features: [
      "Hasta 50 Usuarios",
      "Hasta 20 Sucursales",
      "Hasta 15 Cajas",
      "Módulos personalizados",
      "Soporte 24/7 dedicado"
    ],
    annualDiscountPercent: 20
  }
};