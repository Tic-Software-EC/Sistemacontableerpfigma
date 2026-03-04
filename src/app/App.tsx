import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./contexts/theme-context";
import { RolesProvider } from "./contexts/roles-context";
import { PuntoEmisionProvider } from "./contexts/punto-emision-context";
import { SucursalProvider } from "./contexts/sucursal-context";
import { Toaster } from "sonner";

export default function App() {
  return (
    <ThemeProvider>
      <RolesProvider>
        <SucursalProvider>
          <PuntoEmisionProvider>
            <RouterProvider router={router} />
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              toastOptions={{
                style: { fontFamily: "IBM Plex Sans, sans-serif" },
                duration: 3500,
              }}
            />
          </PuntoEmisionProvider>
        </SucursalProvider>
      </RolesProvider>
    </ThemeProvider>
  );
}