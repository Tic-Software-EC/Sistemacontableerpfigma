import { useEffect } from "react";

export interface ShortcutDef {
  key: string;
  label: string;
  description: string;
  action: () => void;
}

/**
 * Hook genérico para atajos de teclado.
 * Solo se activa cuando el foco NO está en un input/textarea/select.
 */
export function useKeyboardShortcuts(shortcuts: ShortcutDef[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      const found = shortcuts.find((s) => s.key === e.key);
      if (found) {
        e.preventDefault();
        found.action();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}
