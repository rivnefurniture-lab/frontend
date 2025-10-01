import "@/styles/index.css";
import { AuthProvider } from "@/context/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <AuthProvider>{children}</AuthProvider>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
