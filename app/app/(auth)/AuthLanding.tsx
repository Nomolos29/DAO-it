"use client";

import React, { useState } from "react";
import Login from "../(auth)/Login";
import SignUp from "../(auth)/SignUp";
import Logo from "../assets/BigLogo.svg";
import WalletButton from "@/components/walletButton";
import Image from "next/image";
import Link from "next/link";
import { useAddress, useLogin } from "@thirdweb-dev/react";

const AuthLanding = () => {
  const [loginIsOpen, setLoginIsOpen] = useState(false);
  const [signUpIsOpen, setSignUpIsOpen] = useState(false);



  return (
    <div className="w-full h-screen flex justify-center items-center">
      <main className="container w-full flex justify-between items-center gap-x-[150px] px-8">
        <aside className="w-1/2 flex flex-col gap-y-4">
          <Image src={Logo} alt="logo" width={1000} height={1000} className="w-full" />
          
          <p className="text-center text-[16px] text-[#494445] font-medium px-5">
            Take power to shape your school&apos;s future. Join the
            teacher-student-led movement for future-ready learning
          </p>
        </aside>

        <aside className="w-1/2 flex flex-col gap-y-8 px-10">
          <h3 className="text-[36px] text-black">Join Us Today</h3>

          <div className="flex flex-col gap-y-5">
            <button
              type="submit"
              onClick={() => setSignUpIsOpen(true)}
              className="rounded-[10px] cursor-pointer px-2 h-[48px] border-[1.5px] border-[#F8B51C] w-full bg-[#1B1B1B] text-white text-lg"
            >
              Sign Up
            </button>

            <button
              type="button"
              // onClick={() => handleLogin}
              className="rounded-[10px] cursor-pointer px-2 text-lg h-[48px] w-full bg-gradient-to-r from-[#F8B51C] to-[#FEE539]"
            >
              Sign In
            </button>
            <WalletButton />

            <p className="text-[#474747]">
              By signing up, you agree to the{" "}
              <Link href="/terms-and-conditions"><span className="text-[#F8B51C]">Terms of Service</span> and{" "}</Link>
              <span className="text-[#F8B51C]">Privacy Policy</span>
            </p>
          </div>
        </aside>
      </main>

      <Login isOpen={loginIsOpen} onClose={() => setLoginIsOpen(false)} />
      <SignUp isOpen={signUpIsOpen} onClose={() => setSignUpIsOpen(false)} />
    </div>
  );
};

export default AuthLanding;
