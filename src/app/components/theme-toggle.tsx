import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Cargar tema guardado del localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label="Cambiar tema"
    >
      <div
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white dark:bg-gray-900 shadow-md transform transition-transform duration-300 flex items-center justify-center ${
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
