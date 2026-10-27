"use client";

import { usePathname } from "@/lib/navigation";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname().replace(/^\/bn(?=\/|$)/, "") || "/";

  const hideNavbar =
    pathname === "/profile" ||
    pathname === "/profile/edit" ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/watch/") ||
    pathname.startsWith("/admin/manage-course");

  const hideFooter =
    pathname.startsWith("/admin/manage-course") ||
    pathname.startsWith("/admin/users") ||
    pathname.startsWith("/admin/profile") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/watch/") ||
    pathname.startsWith("/verify-email");

  return (
    <div className="flex min-h-screen flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
