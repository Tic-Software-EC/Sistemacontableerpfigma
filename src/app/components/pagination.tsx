import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const { theme } = useTheme();
  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-between px-6 py-4 border-t ${
      theme === "light" ? "border-gray-200" : "border-white/10"
    }`}>
      {totalItems && itemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Mostrar:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className={`border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary ${
                theme === "light"
                  ? "bg-gray-50 border-gray-300 text-gray-900"
                  : "bg-white/5 border-white/10 text-white"
              }`}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>por página</span>
          </div>
          <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
            Mostrando {startItem} a {endItem} de {totalItems} registros
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            theme === "light"
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:hover:bg-transparent disabled:hover:text-gray-600"
              : "text-gray-400 hover:text-white hover:bg-white/5 disabled:hover:bg-transparent disabled:hover:text-gray-400"
          }`}
          title="Página anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={typeof page !== "number"}
              className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-primary text-white"
                  : typeof page === "number"
                  ? theme === "light"
                    ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  : theme === "light"
                  ? "text-gray-400 cursor-default"
                  : "text-gray-500 cursor-default"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            theme === "light"
              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:hover:bg-transparent disabled:hover:text-gray-600"
              : "text-gray-400 hover:text-white hover:bg-white/5 disabled:hover:bg-transparent disabled:hover:text-gray-400"
          }`}
          title="Página siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
