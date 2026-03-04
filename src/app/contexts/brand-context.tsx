import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const DEFAULT_PRIMARY   = "#E8692E";
const DEFAULT_SECONDARY = "#0D1B2A";

interface BrandState {
  primaryColor:   string;
  secondaryColor: string;
  logoUrl:        string; // base64 o URL
}

interface BrandContextType extends BrandState {
  updateColors: (colors: Partial<Pick<BrandState, "primaryColor" | "secondaryColor">>) => void;
  updateLogo:   (logo: string) => void;
  removeLogo:   () => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

/**
 * Aplica colores como variables CSS en :root.
 * Tailwind v4 usa tanto --secondary como --color-secondary → seteamos ambas.
 */
function applyToCSSVars(primary: string, secondary: string) {
  const root = document.documentElement;

  // Primario
  root.style.setProperty("--primary",                primary);
  root.style.setProperty("--color-primary",          primary);
  root.style.setProperty("--accent",                 primary);
  root.style.setProperty("--color-accent",           primary);
  root.style.setProperty("--ring",                   primary);
  root.style.setProperty("--color-ring",             primary);
  root.style.setProperty("--chart-1",                primary);
  root.style.setProperty("--sidebar-primary",        primary);
  root.style.setProperty("--sidebar-ring",           primary);

  // Secundario
  root.style.setProperty("--secondary",              secondary);
  root.style.setProperty("--color-secondary",        secondary);
  root.style.setProperty("--chart-2",                secondary);
  root.style.setProperty("--sidebar",                secondary);
  root.style.setProperty("--color-sidebar",          secondary);
  root.style.setProperty("--foreground",             secondary);
  root.style.setProperty("--color-foreground",       secondary);
}

export function BrandProvider({ children }: { children: ReactNode }) {
  const [primaryColor, setPrimaryColor] = useState<string>(
    () => localStorage.getItem("brand_primary") ?? DEFAULT_PRIMARY
  );
  const [secondaryColor, setSecondaryColor] = useState<string>(
    () => localStorage.getItem("brand_secondary") ?? DEFAULT_SECONDARY
  );
  const [logoUrl, setLogoUrl] = useState<string>(
    () => localStorage.getItem("brand_logo") ?? ""
  );

  // Aplica al montar
  useEffect(() => {
    applyToCSSVars(primaryColor, secondaryColor);
  }, []);

  const updateColors = ({
    primaryColor: p,
    secondaryColor: s,
  }: Partial<Pick<BrandState, "primaryColor" | "secondaryColor">>) => {
    const newPrimary   = p ?? primaryColor;
    const newSecondary = s ?? secondaryColor;

    if (p !== undefined) {
      setPrimaryColor(p);
      localStorage.setItem("brand_primary", p);
    }
    if (s !== undefined) {
      setSecondaryColor(s);
      localStorage.setItem("brand_secondary", s);
    }

    applyToCSSVars(newPrimary, newSecondary);
  };

  const updateLogo = (logo: string) => {
    setLogoUrl(logo);
    localStorage.setItem("brand_logo", logo);
  };

  const removeLogo = () => {
    setLogoUrl("");
    localStorage.removeItem("brand_logo");
  };

  return (
    <BrandContext.Provider
      value={{ primaryColor, secondaryColor, logoUrl, updateColors, updateLogo, removeLogo }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand must be used within BrandProvider");
  return ctx;
}

/**
 * Provider para la página de login.
 * Siempre usa los colores corporativos por defecto, sin importar
 * la personalización de marca guardada en localStorage.
 */
export function LoginBrandProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    applyToCSSVars(DEFAULT_PRIMARY, DEFAULT_SECONDARY);
    return () => {
      const p = localStorage.getItem("brand_primary")  ?? DEFAULT_PRIMARY;
      const s = localStorage.getItem("brand_secondary") ?? DEFAULT_SECONDARY;
      applyToCSSVars(p, s);
    };
  }, []);

  return (
    <BrandContext.Provider
      value={{
        primaryColor:   DEFAULT_PRIMARY,
        secondaryColor: DEFAULT_SECONDARY,
        logoUrl:        "",
        updateColors:   () => {},
        updateLogo:     () => {},
        removeLogo:     () => {},
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

/**
 * Provider para páginas de administrador.
 * Siempre usa los colores corporativos por defecto e ignora
 * cualquier personalización de marca guardada en localStorage.
 */
export function AdminBrandProvider({ children }: { children: ReactNode }) {
  // Al montar, forzamos los colores por defecto en las variables CSS
  useEffect(() => {
    applyToCSSVars(DEFAULT_PRIMARY, DEFAULT_SECONDARY);
    // Al desmontar, restauramos los colores de la empresa
    return () => {
      const p = localStorage.getItem("brand_primary")  ?? DEFAULT_PRIMARY;
      const s = localStorage.getItem("brand_secondary") ?? DEFAULT_SECONDARY;
      applyToCSSVars(p, s);
    };
  }, []);

  return (
    <BrandContext.Provider
      value={{
        primaryColor:   DEFAULT_PRIMARY,
        secondaryColor: DEFAULT_SECONDARY,
        logoUrl:        "",
        updateColors:   () => {},
        updateLogo:     () => {},
        removeLogo:     () => {},
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}