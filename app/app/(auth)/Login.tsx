"use client"


import { useState } from "react";
import Logo from "../assets/smallLogo.svg"
import { Modal } from "../components"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";


interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({isOpen, onClose}) => {

  const [seePassword, setSeePassword] = useState(false);

  const inputStyle = "w-full border border-[#ABABAB] rounded-md px-2 h-[48px] outline-none"

  return (
    <Modal isOpen={isOpen} bgBlured onClose={onClose}>
      <main className="w-[560px] h-[420px] flex flex-col justify-between p-10">
        <Image src={Logo} width={60} height={60} alt="logo" />

        <div className="flex flex-col items-center w-full gap-y-4">
          <h2 className="text-[36px] text-[#474747] font-medium">Sign in on <span className="text-[#F8B51C]">DAOIt</span></h2>

          <form action="" className="flex flex-col gap-y-3 w-full">
            <input type="text" placeholder="Username" className={inputStyle} />
            <div className={`${inputStyle} flex items-center justify-between`}>
              <input type={seePassword ? "text" : "password"} placeholder="Password"  className="outline-none w-full" />
              {seePassword ? <FaEyeSlash onClick={() => setSeePassword(!seePassword)} className="cursor-pointer" /> : <FaEye onClick={() => setSeePassword(!seePassword)} className="cursor-pointer" />}
            </div>
            <button type="submit" className="rounded-md px-2 h-[48px] w-full bg-gradient-to-r from-[#F8B51C] to-[#FEE539]">Sign In</button>
          </form>
        </div>
      </main>
    </Modal>
  )
}

export default Login