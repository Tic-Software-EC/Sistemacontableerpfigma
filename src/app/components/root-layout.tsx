import { Outlet } from "react-router";
import { ThemeProvider } from "../contexts/theme-context";
import { BrandProvider } from "../contexts/brand-context";
import { RolesProvider } from "../contexts/roles-context";
import { PuntoEmisionProvider } from "../contexts/punto-emision-context";
import { SucursalProvider } from "../contexts/sucursal-context";
import { CajaProvider } from "../contexts/caja-context";
import { Toaster } from "sonner";

export default function RootLayout() {
  return (
    <BrandProvider>
      <ThemeProvider>
        <RolesProvider>
          <SucursalProvider>
            <PuntoEmisionProvider>
              <CajaProvider>
                <Outlet />
                <Toaster
                  position="top-right"
                  richColors
                  closeButton
                  toastOptions={{
                    style: { fontFamily: "IBM Plex Sans, sans-serif" },
                    duration: 3500,
                  }}
                />
              </CajaProvider>
            </PuntoEmisionProvider>
          </SucursalProvider>
        </RolesProvider>
      </ThemeProvider>
    </BrandProvider>
  );
}
