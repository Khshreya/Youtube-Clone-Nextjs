
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

          {/* Main content */}
          <div
            className={
              !isAuthPage
                ? "flex-1 flex flex-col h-screen md:ml-[72px]"
                : "flex-1"
            }
          >
            {!isAuthPage && <Navbar />}

            {/* Header area */}
            <div className="pt-14">
              {!isAuthPage && <MobileSearchBar />}
              {!isAuthPage && <CategoryList />}
            </div>

            {/* Scrollable content */}
            <main className="flex-1 overflow-auto relative z-0">
              {children}
            </main>
          </div>
        </ThemeWrapper>
      </body>
    </html>
  );
}
