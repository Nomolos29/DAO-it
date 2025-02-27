"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { useState } from "react";
import AuthLanding from "./(auth)/AuthLanding";
import { Header, SideBar } from "./components";
import { usePathname } from "next/navigation";
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthHandler } from "./(auth)/AuthHandler";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isConnected, setIsConnected] = useState(false);
  const pathname = usePathname();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <QueryClientProvider client={queryClient}>
          <ThirdwebProvider>
            <AuthHandler onConnected={setIsConnected} />
            {isConnected ? (
              <>
                <Header />
                <main className="flex w-full justify-center h-screen">
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
              </>
            ) : (
              <div className="h-screen flex flex-col justify-center items-center">
                <AuthLanding />
                <button
                  type="button"
                  className="rounded-md px-2 h-[48px] w-[200px] bg-gradient-to-r from-[#F8B51C] to-[#FEE539] mt-4"
                  onClick={() => setIsConnected(true)}
                >
                  Continue as Guest
                </button>
              </div>
            )}
          </ThirdwebProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
