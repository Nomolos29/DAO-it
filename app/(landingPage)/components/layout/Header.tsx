"use client";


import React from "react";
import logo from "@/public/logo-white.svg";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
// import { useLocation } from "react-router-dom";


const Header = () => {
  // const location = useLocation();
  const isActive = usePathname();

  const menu = "hover:text-black py-6 px-3"

  return (
    <header className="flex items-center justify-center shadow sticky top-0 z-50 bg-white/70 backdrop-blur-smnp">
      <div className="max-w-screen-2xl w-full flex justify-between items-center px-10">
        <div className="text-xl font-bold">
          <Link href="/">
            <img src="/logo-white.svg" alt="arrow" className="w-full" />
          </Link>
        </div>

        <nav className="flex space-x-6">
          <Link
            href="/developer"
            className={`${menu} ${
              isActive === "/developer" ? "border-b-[2px] border-black font-bold" : "hover:border-black border-b-[2px] border-transparent"
            }`}
          >
            Developer
          </Link>
          <Link
            href="/community"
            className={`${menu} ${
              isActive === "/community" ? "border-b-[2px] border-black font-bold" : "hover:border-black border-b-[2px] border-transparent"
            }`}
          >
            Community
          </Link>
          <Link
            href="/how-it-works"
            className={`${menu} ${
              isActive === "/how-it-works" ? "border-b-[2px] border-black font-bold" : "hover:border-black border-b-[2px] border-transparent"
            }`}
          >
            How it works
          </Link>
        </nav>

        {/* Use the WalletButhrefn component here */}
        {/* <WalletButton /> */}

        <Link href="/app">
          <button type="button" className="bg-gradient-to-r from-[#F8B51C] to-[#FEE539] hover:bg-yellow-600 text-black text-md m-0 rounded shadow-md shadow-[#F8B51C33] w-[140px] h-[44px]">
            Launch App
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
