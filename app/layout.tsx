import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { generateOrganizationJsonLd } from "@/lib/json-ld";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sliceblaze.com'),
  title: {
    default: "Sliceblaze - Your Business Digital Partner",
    template: "%s | Sliceblaze"
  },
  description: "Sliceblaze empowers businesses with digital solutions including WiFi management, digital menus, QR codes, and comprehensive business profiles. Transform your business presence online.",
  keywords: ["digital business solutions", "wifi management", "digital menu", "QR code", "business profile", "restaurant menu", "online presence", "business directory"],
  authors: [{ name: "Sliceblaze" }],
  creator: "Sliceblaze",
  publisher: "Sliceblaze",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sliceblaze.com",
    siteName: "Sliceblaze",
    title: "Sliceblaze - Your Business Digital Partner",
    description: "Sliceblaze empowers businesses with digital solutions including WiFi management, digital menus, QR codes, and comprehensive business profiles.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sliceblaze - Your Business Digital Partner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sliceblaze - Your Business Digital Partner",
    description: "Sliceblaze empowers businesses with digital solutions including WiFi management, digital menus, QR codes, and comprehensive business profiles.",
    images: ["/og-image.jpg"],
    creator: "@sliceblaze",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {generateOrganizationJsonLd()}
      </head>
      <body
        className={`${outfit.variable} font-sans antialiased bg-white`}
        suppressHydrationWarning
      >
        
        {children}
      </body>
    </html>
  );
}

