import { useState } from "react";
import { FileText, CreditCard, FileCheck } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { PurchaseInvoicesContent } from "./purchase-invoices-content";
import { PurchaseCreditNotesContent } from "./purchase-credit-notes-content";
import { PurchaseDebitNotesContent } from "./purchase-debit-notes-content";

type DocType = "invoices" | "credit-notes" | "debit-notes";

export function PurchaseElectronicDocumentsContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [activeDocType, setActiveDocType] = useState<DocType>("invoices");

  const docTypes = [
    { id: "invoices" as DocType, label: "Facturas Recibidas", icon: FileText },
    { id: "credit-notes" as DocType, label: "Notas de Crédito Recibidas", icon: CreditCard },
    { id: "debit-notes" as DocType, label: "Notas de Débito Recibidas", icon: FileCheck },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* ── Tabs de tipo de documento ── */}
      <div className={`flex items-center gap-2 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        {docTypes.map((doc) => {
          const Icon = doc.icon;
          const isActive = activeDocType === doc.id;
          return (
            <button
              key={doc.id}
              onClick={() => setActiveDocType(doc.id)}
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
              {doc.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Contenido según el tipo seleccionado ── */}
      <div>
        {activeDocType === "invoices" && <PurchaseInvoicesContent />}
        {activeDocType === "credit-notes" && <PurchaseCreditNotesContent />}
        {activeDocType === "debit-notes" && <PurchaseDebitNotesContent />}
      </div>
    </div>
  );
}