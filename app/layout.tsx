import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local"
import "./globals.css";
import RippleGrid from "@/components/RippleGrid";
import Navbar from "@/components/Navbar";

const puhuiti = localFont({
  src: '../public/fonts/AlibabaPuHuiTi-3-55-Regular.woff2',
  variable: '--font-puhuiti',
})
const puhuitiSemiBold = localFont({
  src: '../public/fonts/AlibabaPuHuiTi-3-75-SemiBold.woff2',
  variable: '--font-puhuiti-semi-bold',
})

export const metadata: Metadata = {
  title: "会议备忘",
  description: "用于NextJS16练习的Demo项目",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${puhuiti.className} ${puhuitiSemiBold.className} min-h-screen antialiased`}
      >
        <Navbar />
        <div className="absolute top-0 inset-0 z-[-1] min-h-screen">
          <RippleGrid
            enableRainbow={false}
            gridColor="#5dfeca"
            rippleIntensity={0.02}
            gridSize={10}
            gridThickness={15}
            mouseInteraction={true}
            mouseInteractionRadius={1.2}
            opacity={0.8}
          />
        </div>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
