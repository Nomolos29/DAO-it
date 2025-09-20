"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { useState } from "react";
import TutorialPage from "./(auth)/Tutorial";
import { Header, SideBar } from "./components";
import { usePathname } from "next/navigation";
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import FullHeader from "./components/layout/FullHeader";
import AuthLanding from "./(auth)/AuthLanding";
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
  const [isConnected, setIsConnected] = useState<"login" | "register" | "loggedIn">("login");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#F8F8F8] antialiased flex justify-center w-full`}
      >
        <QueryClientProvider client={queryClient}>
          <ThirdwebProvider>
              <main className="max-w-screen-2xl w-full flex justify-center min-h-screen">
                {isConnected === "loggedIn" ? (
                  <main className="flex w-full justify-center h-full overscroll-y-auto">
                    {pathname === "/app/create-proposal" ? (
                      <div className="flex flex-col w-full relative">
                        <FullHeader displayWallet />

                        <main className="w-full pt-[90px] px-4 md:px-0">
                          {children}
                        </main>
                      </div>
                    ) : (
                      <div className="flex w-full relative">
                        {/* Mobile Menu Overlay */}
                        {isMobileMenuOpen && (
                          <div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                          />
                        )}

                        {/* Sidebar */}
                        <aside className={`
                          fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
                          transition-transform duration-300 ease-in-out
                          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        `}>
                          <SideBar
                            isConnected={isConnected === "loggedIn"}
                            onMobileMenuClose={() => setIsMobileMenuOpen(false)}
                          />
                        </aside>

                        <div className="flex flex-col relative w-full h-screen lg:ml-0">
                          <header className="w-full absolute z-30">
                            <Header onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                          </header>
                          <article className="gray h-screen overflow-hidden pt-[80px] p-3 lg:pl-6">
                            {children}
                          </article>
                        </div>
                      </div>
                    )}
                  </main>
                ) : isConnected === "login" ? (
                  <div className="w-full px-4 md:px-0">
                    {/* <FullHeader /> */}
                    <AuthLanding onWalletConnected={(action) => setIsConnected(action)} />
                  </div>
                ) : (<TutorialPage loggedIn={(action) => setIsConnected(action)} />)}
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
