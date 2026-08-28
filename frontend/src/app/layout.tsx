
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/src/components/layout/Header";
import "./globals.css";
import { AnimatedBackground } from "../components/ui/AnimatedBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LearnIA",
  description: "plataform for learning about artificial intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 return (
    <html lang="es" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#131114] text-white antialiased selection:bg-[#752b26] selection:text-white`}>
        <AnimatedBackground />
        
        <Header />
      
        <main>{children}</main>
      </body>
    </html>
  );
}