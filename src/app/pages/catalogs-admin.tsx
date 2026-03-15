import { AdminHeader } from "../components/admin-header";
import { AdminCatalogsTab } from "../components/admin-catalogs-tab";
import { useTheme } from "../contexts/theme-context";
import { useState } from "react";

export default function CatalogsAdminPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [userProfile] = useState({
    name: "Super Admin",
    email: "admin@ticsoftec.com",
    phone: "+593 99 123 4567",
    role: "Administrador de Sistema",
    avatar: "",
  });

  return (
    <div className={`min-h-screen ${
      theme === "light"
        ? "bg-gradient-to-br from-gray-50 via-white to-gray-100"
        : "bg-gradient-to-br from-secondary via-secondary to-[#1a1f2e]"
    }`}>
      {/* Header */}
      <AdminHeader userProfile={userProfile} onProfileUpdate={() => {}} />

      {/* Main Content */}
      <div className="p-6">
        <AdminCatalogsTab theme={theme} isLight={isLight} />
      </div>
    </div>
  );
}