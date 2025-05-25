"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
// CSS for react-toastify is imported in the ToastContainer component
import { useState, useEffect, Suspense, lazy } from "react";
import { usePathname } from "next/navigation";
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthHandler } from "./(auth)/AuthHandler";
import ToastContainerWrapper from "./components/ToastContainer";
import ErrorBoundary from "./components/ErrorBoundary";

// Dynamically import components that aren't needed immediately
const TutorialPage = lazy(() => import("./(auth)/Tutorial"));
const Header = lazy(() => import("./components/layout/Header").then(mod => ({ default: mod.default })));
const SideBar = lazy(() => import("./components/layout/SideBar"));
const FullHeader = lazy(() => import("./components/layout/FullHeader"));

// Loading components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen w-full">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1D54E1]"></div>
  </div>
);

const LoadingHeader = () => (
  <div className="w-full h-[80px] bg-white shadow animate-pulse"></div>
);

const LoadingSidebar = () => (
  <div className="w-[250px] h-screen bg-white animate-pulse"></div>
);

// Global error fallback component
const GlobalErrorFallback = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-50 p-6">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-6">
        We're sorry, but something went wrong with the application. Please try refreshing the page or come back later.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Page
        </button>
        <a
          href="/"
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-center"
        >
          Go to Home Page
        </a>
      </div>
    </div>
  </div>
);

// Font configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
});

// Create a client-side singleton QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (garbage collection time, formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Log errors to console and potentially to an error tracking service
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error("Global error caught:", error, errorInfo);
    // Here you could send the error to an error tracking service like Sentry
  };

  // Simulate initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Short timeout to allow components to initialize
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} bg-[#F8F8F8] antialiased flex justify-center w-full`}>
          <LoadingSpinner />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-[#F8F8F8] antialiased flex justify-center w-full`}
      >
        <ErrorBoundary fallback={<GlobalErrorFallback />} onError={handleError}>
          <QueryClientProvider client={queryClient}>
            <ThirdwebProvider>
              <AuthHandler onConnected={setIsConnected} />
              <main className="max-w-screen-2xl w-full flex justify-center h-screen">
                {isConnected ? (
                  <main className="flex w-full justify-center h-full overscroll-y-auto">
                    {pathname === "/app/create-proposal" ? (
                      <div className="flex flex-col w-full relative">
                        <Suspense fallback={<LoadingHeader />}>
                          <FullHeader displayWallet />
                        </Suspense>
                        
                        <main className="w-full pt-[90px]">
                          <Suspense fallback={<LoadingSpinner />}>
                            <ErrorBoundary>
                              {children}
                            </ErrorBoundary>
                          </Suspense>
                        </main>
                      </div>
                    ) : (
                      <div className="flex w-full">
                        <aside className="">
                          <Suspense fallback={<LoadingSidebar />}>
                            <SideBar isConnected={isConnected} />
                          </Suspense>
                        </aside>
                        
                        <div className="flex flex-col relative w-full h-screen">
                          <header className="w-full absolute z-30">
                            <Suspense fallback={<LoadingHeader />}>
                              <Header />
                            </Suspense>
                          </header>
                          <article className="gray h-screen overflow-hidden pt-[80px] p-3">
                            <Suspense fallback={<LoadingSpinner />}>
                              <ErrorBoundary>
                                {children}
                              </ErrorBoundary>
                            </Suspense>
                          </article>
                        </div>
                      </div>
                    )}
                  </main>
                ) : (
                  <div className="w-full">
                    <Suspense fallback={<LoadingSpinner />}>
                      <ErrorBoundary>
                        <TutorialPage />
                      </ErrorBoundary>
                    </Suspense>
                  </div>
                )}
              </main>
            </ThirdwebProvider>
          </QueryClientProvider>
          <ToastContainerWrapper />
        </ErrorBoundary>
      </body>
    </html>
  );
}
