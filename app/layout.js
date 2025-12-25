"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import ThemeWrapper from "@/components/ThemeWrapper";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import CategoryList from "@/components/CategoryList";
import MobileSearchBar from "@/components/MobileSearchBar";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" || pathname === "/register";

  return (
    <html lang="en">
      <body>
        <ThemeWrapper>
          {!isAuthPage && <Sidebar />}

          <div className={!isAuthPage ? "flex-1 flex flex-col h-screen" : "flex-1"}>
            {!isAuthPage && <Navbar />}

            {/* Header area (below nav) stays constant */}
            <div className="pt-14">
              {!isAuthPage && <MobileSearchBar />}
              {!isAuthPage && <CategoryList />}
            </div>

            {/* Scrollable content area */}
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </ThemeWrapper>
      </body>
    </html>
  );
}
