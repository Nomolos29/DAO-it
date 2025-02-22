import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ReactSVG } from "react-svg";
import logo from "../../../../public/logo.svg";
import WalletButton from "@/components/WalletButton"; // Adjust the import path as needed

const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="flex items-center justify-center">
      <div className="max-w-screen-2xl w-full flex justify-between items-center p-4 px-10">
        <div className="text-xl font-bold">
          <Link to="/">
            <ReactSVG src={logo} style={{ width: 100, height: 100 }} />
          </Link>
        </div>

        <nav className="flex space-x-6">
          <Link
            to="/developers"
            className={`hover:border-b-2 hover:text-black ${
              isActive("/developers") ? "border-b-2 border-black" : ""
            }`}
          >
            Developers
          </Link>
          <Link
            to="/community"
            className={`hover:border-b-2 hover:text-black ${
              isActive("/community") ? "border-b-2 border-black" : ""
            }`}
          >
            Community
          </Link>
          <Link
            to="/how-it-works"
            className={`hover:border-b-2 hover:text-black ${
              isActive("/how-it-works") ? "border-b-2 border-black" : ""
            }`}
          >
            How it works
          </Link>
        </nav>

        {/* Use the WalletButton component here */}
        <WalletButton />
      </div>
    </header>
  );
};

export default Header;
