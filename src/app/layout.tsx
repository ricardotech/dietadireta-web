import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/contexts/Providers";

/*------------------------------------------------------------
  1.  Font setup
------------------------------------------------------------*/
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/*------------------------------------------------------------
  2.  Site-wide metadata (Open Graph + Twitter)
      ⚠️  Replace `https://dietabox.com` with your real domain.
------------------------------------------------------------*/
export const metadata: Metadata = {
  metadataBase: new URL("https://dietabox.com"),   // absolute base for URLs
  title: "Dieta Box | O maior site de dietas do Brasil",
  description:
    "O site Dieta Box foi considerado o maior e melhor site de dietas do Brasil, com mais de 5 milhões de receitas ao todo.",
  openGraph: {
    type: "website",
    url: "https://dietabox.com",
    title: "Dieta Box | O maior site de dietas do Brasil",
    description:
      "O site Dieta Box foi considerado o maior e melhor site de dietas do Brasil, com mais de 5 milhões de receitas ao todo.",
    images: [
      {
        url: "/thumbnail.jpg", // lives in /public
        width: 1200,          // standard OG size
        height: 630,
        alt: "Thumbnail Dieta Box",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dieta Box | O maior site de dietas do Brasil",
    description:
      "O site Dieta Box foi considerado o maior e melhor site de dietas do Brasil, com mais de 5 milhões de receitas ao todo.",
    images: ["/thumbnail.jpg"],
  },
};

/*------------------------------------------------------------
  3.  Root layout
------------------------------------------------------------*/
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
