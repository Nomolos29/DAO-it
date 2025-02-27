"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { useState } from "react";
import AuthLanding from "./(auth)/AuthLanding";
import { Header, SideBar } from "./components";
import { usePathname } from "next/navigation";
import { ThirdwebProvider } from "thirdweb/react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isConnected, setIsConnected] = useState(true);
  const pathname = usePathname();
  return (
    <html lang="en">
      {isConnected ? (
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white h-screen`}
        >
          <ThirdwebProvider>
            <Header />
            <main className="flex w-full justify-center">
              {pathname === "/app/create-proposal" ? (
                <div className="container">{children}</div>
              ) : (
                <div className="container grid grid-cols-6">
                  <aside className="grid col-span-1">
                    <SideBar />
                  </aside>
                  <article className="grid col-span-5">{children}</article>
                </div>
              )}
            </main>
          </ThirdwebProvider>
        </body>
      ) : (
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
        >
          <AuthLanding />
          <button
            type="button"
            className="rounded-md px-2 h-[48px] w-full bg-gradient-to-r from-[#F8B51C] to-[#FEE539]"
            onClick={() => setIsConnected(true)}
          >
            Continue as Guest
          </button>
        </body>
      )}
    </html>
  );
}
