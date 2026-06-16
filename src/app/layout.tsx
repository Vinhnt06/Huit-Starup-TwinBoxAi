import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "FreshTwin AI // HỆ THỐNG GIÁM SÁT CHUỖI LẠNH TỰ ĐỘNG",
  description: "Bảng điều khiển telemetry kiểm soát ethylene C2H4, nhiệt độ, độ ẩm và dự đoán thời gian bảo quản (DSL) nông sản bằng AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-[#EAEAEA] selection:bg-[#FF2A2A] selection:text-[#0A0A0A]">
        {children}
      </body>
    </html>
  );
}
