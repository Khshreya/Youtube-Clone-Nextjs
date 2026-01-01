"use client";

import { usePathname } from "next/navigation";
import ThemeWrapper from "@/components/ThemeWrapper";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import CategoryList from "@/components/CategoryList";
import MobileSearchBar from "@/components/MobileSearchBar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/sign-in" || pathname === "/sign-up";

  return (
    <ThemeWrapper>
      {!isAuthPage && <Sidebar />}

      <div
        className={
          !isAuthPage
            ? "flex-1 flex flex-col h-screen md:ml-[72px]"
            : "flex-1"
        }
      >
        {!isAuthPage && <Navbar />}

        <div className="pt-14">
          {!isAuthPage && <MobileSearchBar />}
          {!isAuthPage && <CategoryList />}
        </div>

        <main className="flex-1 overflow-auto relative z-0">
          {children}
        </main>
      </div>
    </ThemeWrapper>
  );
}
