import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TwinBox AI — Giám Sát Chuỗi Lạnh Nông Sản Bằng AI",
  description:
    "TwinBox AI là hệ thống IoT thông minh giám sát thời gian thực nhiệt độ, khí Ethylene (C2H4) và dự đoán thời hạn tươi ngon của nông sản trong container lạnh. Tiết kiệm chi phí, giảm hao hụt, tối ưu chuỗi cung ứng.",
  keywords: [
    "TwinBox AI",
    "chuỗi lạnh nông sản",
    "giám sát container lạnh",
    "IoT nông nghiệp",
    "Ethylene C2H4",
    "Dynamic Shelf Life",
    "FEFO logistics",
    "ESP32 mesh",
    "cold chain monitoring",
    "agricultural IoT Vietnam",
  ],
  authors: [{ name: "TwinBox AI Corp" }],
  creator: "TwinBox AI Corp",
  publisher: "TwinBox AI Corp",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    title: "TwinBox AI — Giám Sát Chuỗi Lạnh Nông Sản Bằng AI",
    description:
      "Hệ thống IoT thông minh giám sát nhiệt độ, khí Ethylene & dự đoán thời hạn tươi ngon nông sản theo thời gian thực. Giảm thiểu hao hụt xuống dưới 10%.",
    siteName: "TwinBox AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "TwinBox AI — Giám Sát Chuỗi Lạnh Nông Sản Bằng AI",
    description:
      "Hệ thống IoT thông minh giám sát nhiệt độ, khí Ethylene & dự đoán thời hạn tươi ngon nông sản theo thời gian thực.",
    creator: "@twinboxai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://twinboxai.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#F7F8FA" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "TwinBox AI",
              description:
                "Hệ thống giám sát chuỗi lạnh nông sản thông minh sử dụng IoT & AI",
              applicationCategory: "IoT & Agricultural Technology",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                availability: "https://schema.org/InStock",
              },
              creator: {
                "@type": "Organization",
                name: "TwinBox AI Corp",
                url: "https://twinboxai.com",
              },
              keywords:
                "cold chain monitoring, agricultural IoT, Ethylene sensor, dynamic shelf life",
            }),
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-full flex flex-col bg-[#F7F8FA] text-[#0F1117] selection:bg-green-100 selection:text-green-800`}
      >
        {children}
      </body>
    </html>
  );
}
