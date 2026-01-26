import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../../globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Register - Sliceblaze",
  description: "Create your account",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} font-sans antialiased bg-white`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

