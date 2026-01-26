import { Outfit } from "next/font/google";
import "../globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Admin Panel - Sliceblaze",
  description: "Admin dashboard for Sliceblaze",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-sans antialiased bg-gray-50`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}

