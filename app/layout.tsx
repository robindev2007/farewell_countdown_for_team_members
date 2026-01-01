import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Custom CSS variable
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat", // Custom CSS variable
});

export const metadata: Metadata = {
  title: "Journey Time Left | Team Binay",
  description: "Countdown for Junyet Alam SMT Operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${montserrat.variable} font-sans antialiased bg-[#050507]`}>
        {children}
      </body>
    </html>
  );
}
