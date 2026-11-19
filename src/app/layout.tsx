import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartContext";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vendora.vn";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vendora – Tuyển Chọn Xưởng Chế Tác Độc Bản Việt Nam",
    template: "%s | Vendora",
  },
  description:
    "Trải nghiệm mua sắm từ các xưởng thủ công độc lập gom chung một giỏ hàng, thanh toán hợp nhất và ký quỹ an toàn 15 ngày.",
  keywords: [
    "thủ công mỹ nghệ",
    "bàn phím cơ thủ công",
    "gốm bát tràng",
    "đồ da handmade",
    "multi-vendor",
    "vietnam craft",
    "vendora",
  ],
  authors: [{ name: "Vendora Team" }],
  creator: "Vendora",
  publisher: "Vendora Vietnam",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteUrl,
    title: "Vendora – Tuyển Chọn Xưởng Chế Tác Độc Bản Việt Nam",
    description:
      "Nền tảng thương mại điện tử tuyển chọn xưởng thủ công Việt Nam: Đa xưởng gom 1 giỏ hàng, ký quỹ Escrow minh bạch.",
    siteName: "Vendora",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vendora – Tuyển Chọn Xưởng Chế Tác Độc Bản Việt Nam",
    description:
      "Trải nghiệm mua sắm từ các xưởng thủ công độc lập gom chung một giỏ hàng, thanh toán hợp nhất và ký quỹ an toàn 15 ngày.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
