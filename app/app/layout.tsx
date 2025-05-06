"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { useState } from "react";
import TutorialPage from "./(auth)/Tutorial";
import { Header, SideBar } from "./components";
import { usePathname } from "next/navigation";
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthHandler } from "./(auth)/AuthHandler";
import { ToastContainer } from "react-toastify";
import FullHeader from "./components/layout/FullHeader";
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
        className={`${geistSans.variable} ${geistMono.variable} bg-[#F8F8F8] antialiased flex justify-center w-full`}
      >
        <QueryClientProvider client={queryClient}>
          <ThirdwebProvider>
            <AuthHandler onConnected={setIsConnected} />
              <main className="max-w-screen-2xl w-full flex justify-center h-screen">
                {isConnected ? (
                  <main className="flex w-full justify-center h-full overscroll-y-auto">
                    {pathname === "/app/create-proposal" ? (
                      <div className="flex flex-col w-full relative">
                        <FullHeader displayWallet />
                        
                        <main className="w-full pt-[90px]">
                          {children}
                        </main>
                      </div>
                    ) : (
                      <div className="flex w-full">
                        <aside className="">
                          <SideBar />
                        </aside>
                        
                        <div className="flex flex-col relative w-full h-screen">
                          <header className="w-full absolute z-30">
                            <Header />
                          </header>
                          <article className="gray h-screen overflow-hidden pt-[80px] p-3">
                            {children}
                          </article>
                        </div>
                      </div>
                    )}
                  </main>
                ) : (
                  <div className="w-full">
                    <TutorialPage />
                  </div>
                )}
              </main>
          </ThirdwebProvider>
        </QueryClientProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000} // Close toast after 5 seconds
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </body>
    </html>
  );
}
