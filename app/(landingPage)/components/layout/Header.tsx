"use client";


import React from "react";
import logo from "../../../../public/logo.svg";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
// import { useLocation } from "react-router-dom";


const Header = () => {
  // const location = useLocation();
  const isActive = usePathname();

  return (
    <header className="flex items-center justify-center">
      <div className="max-w-screen-2xl w-full flex justify-between items-center p-4 px-10">
        <div className="text-xl font-bold">
          <Link href="/">
            <Image src={logo} alt="arrow" width={20} height={20} />
          </Link>
        </div>

        <nav className="flex space-x-6">
          <Link
            href="/developers"
            className={`hover:border-b-2 hover:text-black ${
              isActive === "/developers" ? "border-b-2 border-black" : ""
            }`}
          >
            Developers
          </Link>
          <Link
            href="/community"
            className={`hover:border-b-2 hover:text-black ${
              isActive === "/community" ? "border-b-2 border-black" : ""
            }`}
          >
            Community
          </Link>
          <Link
            href="/how-it-works"
            className={`hover:border-b-2 hover:text-black ${
              isActive === "/how-it-works" ? "border-b-2 border-black" : ""
            }`}
          >
            How it works
          </Link>
        </nav>

        {/* Use the WalletButhrefn component here */}
        {/* <WalletButton /> */}
      </div>
    </header>
  );
};

export default Header;
