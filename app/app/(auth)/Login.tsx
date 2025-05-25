"use client"

import { useState, FormEvent } from "react";
import { Modal } from "../components"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import { useAuth } from "../services/authService";
import { useRouter } from "next/navigation";
import toast from "../utils/toast";

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({isOpen, onClose}) => {
  const [seePassword, setSeePassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { loginWithWallet } = useAuth();
  const router = useRouter();

  const inputStyle = "w-full border border-[#ABABAB] rounded-md px-2 h-[48px] outline-none";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, we would call an API endpoint for username/password login
      // For now, we'll just simulate a successful login
      toast.success("Successfully logged in!");
      router.push("/app");
      onClose();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} bgBlured onClose={onClose}>
      <main className="w-[560px] h-[420px] flex flex-col justify-between p-10">
        <Image src="/app/assets/smallLogo.svg" width={60} height={60} alt="logo" />

        <div className="flex flex-col items-center w-full gap-y-4">
          <h2 className="text-[36px] text-[#474747] font-medium">Sign in on <span className="text-[#F8B51C]">DAOIt</span></h2>

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
            <button 
              type="submit" 
              className="rounded-md px-2 h-[48px] w-full bg-gradient-to-r from-[#F8B51C] to-[#FEE539]"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </main>
    </Modal>
  )
}

export default Login
