// app/layout.js
import "./globals.css";
import ThemeWrapper from "@/components/ThemeWrapper";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import CategoryList from "@/components/CategoryList";

export const metadata = { title: "YouTube Clone" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ThemeWrapper>
        <Sidebar />
        <div className="flex-1 pt-14"> {/* space for fixed navbar */}
          <Navbar />
          <CategoryList />   {/* <= row of chips under search bar */}
          {children}
        </div>
      </ThemeWrapper>
    </html>
  );
}
