import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ClientLayout from "@/components/ClientLayout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ClerkProvider>
      </body>
    </html>
  );
}
