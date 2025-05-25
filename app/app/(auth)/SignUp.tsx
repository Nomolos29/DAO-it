"use client"

import { useState, FormEvent } from "react";
import { Modal } from "../components"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import { useAuth } from "../services/authService";
import { useRouter } from "next/navigation";
import toast from "../utils/toast";
import Link from "next/link";

interface SignUpProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignUp: React.FC<SignUpProps> = ({isOpen, onClose}) => {
  const [seePassword, setSeePassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { registerWallet } = useAuth();
  const router = useRouter();

  const inputStyle = "w-full border border-[#ABABAB] rounded-md px-2 h-[48px] outline-none";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, we would call an API endpoint for username/password registration
      // For now, we'll just simulate a successful registration
      toast.success("Successfully registered!");
      router.push("/app");
      onClose();
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} bgBlured onClose={onClose}>
      <main className="w-[560px] h-[460px] flex flex-col justify-between px-10 py-3">
        <Image src="/app/assets/smallLogo.svg" width={60} height={60} alt="logo" />

        <div className="flex flex-col items-center w-full gap-y-4">
          <h2 className="text-[36px] text-[#474747] font-medium">Sign up on <span className="text-[#F8B51C]">DAOIt</span></h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-y-3 w-full">
            <input 
              type="text" 
              placeholder="Username" 
              className={inputStyle} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <div className={`${inputStyle} flex items-center justify-between`}>
              <input 
                type={seePassword ? "text" : "password"} 
                placeholder="Password"  
                className="outline-none w-full" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {seePassword ? 
                <FaEyeSlash onClick={() => setSeePassword(!seePassword)} className="cursor-pointer" /> : 
                <FaEye onClick={() => setSeePassword(!seePassword)} className="cursor-pointer" />
              }
            </div>

            <div className={`${inputStyle} flex items-center justify-between`}>
              <input 
                type={seePassword ? "text" : "password"} 
                placeholder="Confirm Password"  
                className="outline-none w-full" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {seePassword ? 
                <FaEyeSlash onClick={() => setSeePassword(!seePassword)} className="cursor-pointer" /> : 
                <FaEye onClick={() => setSeePassword(!seePassword)} className="cursor-pointer" />
              }
            </div>

            <button 
              type="submit" 
              className="rounded-md px-2 h-[48px] w-full bg-gradient-to-r from-[#F8B51C] to-[#FEE539]"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
            <p className='text-[#474747]'>
              By signing up, you agree to the{" "}
              <Link href="/terms-and-conditions"><span className='text-[#F8B51C]'>Terms of Service</span></Link> and{" "}
              <span className='text-[#F8B51C]'>Privacy Policy</span>
            </p>
          </form>
        </div>
      </main>
    </Modal>
  )
}

export default SignUp
