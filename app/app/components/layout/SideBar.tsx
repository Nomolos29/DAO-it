import Link from "next/link";
import { SideBarMenu } from "../../lib/NavsAndLinks";
import { usePathname } from "next/navigation";
import WalletButton from "@/components/walletButton";

const SideBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="py-10 pr-5 max-h-[calc(100vh-60px)] h-full">
      <nav className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-y-[30px]">
          {SideBarMenu.map((navItem, index) => (
            <Link
              key={index}
              href={navItem.navLink}
              className={`flex items-center gap-x-3 ${
                pathname === navItem.navLink
                  ? "text-black font-semibold"
                  : "hover:text-black"
              } group text-[#474747]`}
            >
              <span className="text-2xl">
                <navItem.navIcon />
              </span>
              <span className="group-hover:font-semibold">
                {navItem.navTitle}
              </span>
            </Link>
          ))}
        </div>
        <WalletButton />
      </nav>
    </div>
  );
};

export default SideBar;
