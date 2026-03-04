import { Keyboard, X } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import type { ShortcutDef } from "../hooks/useKeyboardShortcuts";

interface Props {
  open: boolean;
  onClose: () => void;
  shortcuts: ShortcutDef[];
  title?: string;
}

export function KeyboardShortcutsPanel({
  open,
  onClose,
  shortcuts,
  title = "Atajos de Teclado",
}: Props) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!open) return null;

  const bg      = isLight ? "bg-white border-gray-200"     : "bg-[#0D1B2A] border-white/10";
  const txt     = isLight ? "text-gray-900"                : "text-white";
  const sub     = isLight ? "text-gray-500"                : "text-gray-400";
  const kbd     = isLight
    ? "bg-gray-100 border-gray-300 text-gray-700 shadow-[0_2px_0_0_#d1d5db]"
    : "bg-white/10 border-white/20 text-white shadow-[0_2px_0_0_rgba(255,255,255,0.08)]";
  const row     = isLight ? "hover:bg-gray-50"             : "hover:bg-white/5";
  const divider = isLight ? "border-gray-100"              : "border-white/10";

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden ${bg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${divider}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className={`font-bold text-sm ${txt}`}>{title}</h2>
              <p className={`text-xs ${sub}`}>Navega rápido sin usar el mouse</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isLight ? "hover:bg-gray-100 text-gray-400" : "hover:bg-white/10 text-gray-400"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista de atajos */}
        <div className="p-3 space-y-1">
          {shortcuts.map((s, i) => (
            <button
              key={s.key}
              onClick={() => { s.action(); onClose(); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors text-left ${row}`}
            >
              <span className={`text-sm ${txt}`}>{s.description}</span>
              <kbd className={`px-2.5 py-1 rounded-md border text-xs font-bold font-mono ${kbd}`}>
                {s.label}
              </kbd>
            </button>
          ))}

          {/* Cerrar */}
          <div className={`mt-2 pt-2 border-t ${divider} flex items-center justify-between px-4 py-2`}>
            <span className={`text-xs ${sub}`}>Cerrar este panel</span>
            <kbd className={`px-2.5 py-1 rounded-md border text-xs font-bold font-mono ${kbd}`}>Esc</kbd>
          </div>
        </div>

        <p className={`text-center text-[11px] pb-3 ${sub}`}>
          No funciona dentro de campos de texto
        </p>
      </div>
    </div>
  );
}
