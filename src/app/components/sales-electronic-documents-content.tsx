import { useState } from "react";
import { FileText, RotateCcw, TrendingDown, FileCheck } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { SalesInvoicesContent } from "./sales-invoices-content";
import { SalesCreditNotesContent } from "./sales-credit-notes-content";
import { SalesDebitNotesContent } from "./sales-debit-notes-content";
import { AccountingRetentionsContent } from "./accounting-retentions-content";

export function SalesElectronicDocumentsContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [activeDocType, setActiveDocType] = useState<"invoices" | "credit-notes" | "debit-notes" | "retentions">("invoices");

  const tabs = [
    { id: "invoices" as const, name: "Facturas", icon: FileText },
    { id: "credit-notes" as const, name: "Notas de Crédito", icon: RotateCcw },
    { id: "debit-notes" as const, name: "Notas de Débito", icon: TrendingDown },
    { id: "retentions" as const, name: "Retenciones Recibidas", icon: FileCheck },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* ── Tabs de tipo de documento ── */}
      <div className={`flex items-center gap-2 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDocType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDocType(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all relative ${
                isActive
                  ? isLight
                    ? "text-primary"
                    : "text-primary"
                  : isLight
                  ? "text-gray-500 hover:text-gray-700"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
              {tab.name}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Contenido por tipo de documento ── */}
      <div>
        {activeDocType === "invoices" && <SalesInvoicesContent />}
        {activeDocType === "credit-notes" && <SalesCreditNotesContent />}
        {activeDocType === "debit-notes" && <SalesDebitNotesContent />}
        {activeDocType === "retentions" && <AccountingRetentionsContent filterByCategory="ventas" />}
      </div>
    </div>
  );
}