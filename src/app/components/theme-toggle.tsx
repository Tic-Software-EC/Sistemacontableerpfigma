import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        theme === "dark" ? "bg-primary/30" : "bg-gray-200"
      }`}
      aria-label="Cambiar tema"
      title={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          theme === "dark" ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {theme === "light" ? (
          <Sun className="w-4 h-4 text-primary" />
        ) : (
          <Moon className="w-4 h-4 text-primary" />
        )}
      </div>
    </button>
  );
}

/** Botón icónico simple Sol/Luna para headers */
export function ThemeToggleIcon() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-all duration-300 ${
        isLight
          ? "text-gray-600 hover:text-primary hover:bg-gray-100"
          : "text-gray-400 hover:text-primary hover:bg-white/5"
      }`}
      title={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
    >
      {isLight ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}
