
import Logo from "../assets/BigLogo.svg";
import WalletButton from "@/components/walletButton";
import Image from "next/image";
import Link from "next/link";

interface AuthLandingProps {
  onWalletConnected?: (action: "register" | "loggedIn") => void;
}

const AuthLanding = ({onWalletConnected}:AuthLandingProps) => {

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
            {/* Pass props to WalletButton to listen for wallet connection */}
            <WalletButton onConnect={(action) => onWalletConnected?.(action)} />

            <p className="text-[#474747]">
              By signing up, you agree to the{" "}
              <Link href="/terms-and-conditions">
                <span className="text-[#F8B51C]">Terms of Service</span>
              </Link>{" "}
              and <span className="text-[#F8B51C]">Privacy Policy</span>
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default AuthLanding;
