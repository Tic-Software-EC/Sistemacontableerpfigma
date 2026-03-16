import { createContext, useContext, useState, ReactNode } from "react";

export interface Cheque {
  id: string;
  numero: string;
  fecha: string;
  beneficiario: string;
  concepto: string;
  monto: number;
  banco: string;
  cuenta: string;
  estado: "emitido" | "impreso" | "cobrado" | "anulado";
  fechaImpresion?: string;
  fechaCobro?: string;
  usuarioEmision: string;
  tipo?: "proveedor" | "nomina" | "manual";
  relacionadoId?: string; // ID del proveedor o empleado
}

interface CajaBancosContextType {
  cheques: Cheque[];
  agregarCheque: (cheque: Cheque) => void;
  imprimirCheque: (id: string) => void;
  anularCheque: (id: string) => void;
  marcarComoCobrado: (id: string) => void;
}

const CajaBancosContext = createContext<CajaBancosContextType | undefined>(undefined);

export function CajaBancosProvider({ children }: { children: ReactNode }) {
  const [cheques, setCheques] = useState<Cheque[]>([
    {
      id: "1",
      numero: "001234",
      fecha: "07/03/2026",
      beneficiario: "Servicios Básicos EC",
      concepto: "Pago servicios agua y luz - Marzo 2026",
      monto: 450.00,
      banco: "Banco Pichincha",
      cuenta: "2100456789",
      estado: "cobrado",
      fechaImpresion: "07/03/2026",
      fechaCobro: "10/03/2026",
      usuarioEmision: "Admin",
      tipo: "manual",
    },
    {
      id: "2",
      numero: "001235",
      fecha: "10/03/2026",
      beneficiario: "Distribuidora del Norte S.A.",
      concepto: "Pago Factura #001-001-000145",
      monto: 5824.00,
      banco: "Banco Pichincha",
      cuenta: "2100456789",
      estado: "impreso",
      fechaImpresion: "10/03/2026",
      usuarioEmision: "Admin",
      tipo: "proveedor",
      relacionadoId: "1",
    },
    {
      id: "3",
      numero: "001236",
      fecha: "12/03/2026",
      beneficiario: "Alquiler Oficina Central",
      concepto: "Arriendo Marzo 2026",
      monto: 1200.00,
      banco: "Banco Pichincha",
      cuenta: "2100456789",
      estado: "emitido",
      usuarioEmision: "Admin",
      tipo: "manual",
    },
  ]);

  const agregarCheque = (cheque: Cheque) => {
    setCheques(prev => [...prev, cheque]);
  };

  const imprimirCheque = (id: string) => {
    setCheques(prev =>
      prev.map(cheque =>
        cheque.id === id
          ? {
              ...cheque,
              estado: "impreso" as const,
              fechaImpresion: new Date().toLocaleDateString('es-EC'),
            }
          : cheque
      )
    );
  };

  const anularCheque = (id: string) => {
    setCheques(prev =>
      prev.map(cheque =>
        cheque.id === id
          ? { ...cheque, estado: "anulado" as const }
          : cheque
      )
    );
  };

  const marcarComoCobrado = (id: string) => {
    setCheques(prev =>
      prev.map(cheque =>
        cheque.id === id
          ? {
              ...cheque,
              estado: "cobrado" as const,
              fechaCobro: new Date().toLocaleDateString('es-EC'),
            }
          : cheque
      )
    );
  };

  return (
    <CajaBancosContext.Provider
      value={{
        cheques,
        agregarCheque,
        imprimirCheque,
        anularCheque,
        marcarComoCobrado,
      }}
    >
      {children}
    </CajaBancosContext.Provider>
  );
}

export function useCajaBancos() {
  const context = useContext(CajaBancosContext);
  if (context === undefined) {
    throw new Error("useCajaBancos debe usarse dentro de CajaBancosProvider");
  }
  return context;
}
