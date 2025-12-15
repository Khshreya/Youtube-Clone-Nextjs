import "./globals.css";
import ThemeWrapper from "@/components/ThemeWrapper";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import CategoryList from "@/components/CategoryList";
import MobileSearchBar from "@/components/MobileSearchBar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeWrapper>
          <Sidebar />
          <div className="flex-1 pt-14">
            <Navbar />

            {/* ✅ MOBILE SEARCH ONLY */}
            <MobileSearchBar />

            {/* ✅ CATEGORY LIST STAYS */}
            <CategoryList />

            {children}
          </div>
        </ThemeWrapper>
      </body>
    </html>
  );
}