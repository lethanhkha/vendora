import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartContext";

export const metadata: Metadata = {
  title: "Vendora – Tuyển Chọn Xưởng Chế Tác Độc Bản Việt Nam",
  description: "Trải nghiệm mua sắm từ các xưởng thủ công độc lập gom chung một giỏ hàng, thanh toán hợp nhất và ký quỹ an toàn 15 ngày.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col bg-canvas text-ink antialiased">
        <CartProvider>
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
