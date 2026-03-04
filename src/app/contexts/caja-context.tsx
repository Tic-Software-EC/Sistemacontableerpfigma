import { createContext, useContext, useState, ReactNode } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CajaExpense = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CajaSale = any;

interface CajaContextValue {
  isCajaOpen: boolean;
  montoInicialCaja: number;
  horaApertura: string;
  expenses: CajaExpense[];
  sales: CajaSale[];
  openCaja: (monto: number) => void;
  closeCaja: () => void;
  addExpense: (expense: CajaExpense) => void;
  addSale: (sale: CajaSale) => void;
}

const CajaCtx = createContext<CajaContextValue | null>(null);

export function CajaProvider({ children }: { children: ReactNode }) {
  const [isCajaOpen, setIsCajaOpen] = useState(false);
  const [montoInicialCaja, setMontoInicialCaja] = useState(0);
  const [horaApertura, setHoraApertura] = useState("");
  const [expenses, setExpenses] = useState<CajaExpense[]>([]);
  const [sales, setSales] = useState<CajaSale[]>([]);

  const openCaja = (monto: number) => {
    const now = new Date();
    setIsCajaOpen(true);
    setMontoInicialCaja(monto);
    setHoraApertura(
      now.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const closeCaja = () => {
    setIsCajaOpen(false);
    setMontoInicialCaja(0);
    setHoraApertura("");
    setExpenses([]);
    setSales([]);
  };

  const addExpense = (expense: CajaExpense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  const addSale = (sale: CajaSale) => {
    setSales((prev) => [...prev, sale]);
  };

  return (
    <CajaCtx.Provider
      value={{
        isCajaOpen,
        montoInicialCaja,
        horaApertura,
        expenses,
        sales,
        openCaja,
        closeCaja,
        addExpense,
        addSale,
      }}
    >
      {children}
    </CajaCtx.Provider>
  );
}

export function useCaja() {
  const c = useContext(CajaCtx);
  if (!c) throw new Error("useCaja must be used within CajaProvider");
  return c;
}