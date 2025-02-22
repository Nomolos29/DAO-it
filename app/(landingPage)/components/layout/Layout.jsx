import React from "react";
import { Outlet } from "react-router-dom";
// import Header from "./header";
// import Footer from "./footer";
import { Header, Footer } from "../../components"

function LandingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-header-pattern bg-no-repeat bg-right-top">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default LandingLayout;
