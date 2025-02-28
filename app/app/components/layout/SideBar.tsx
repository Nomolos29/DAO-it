import Link from "next/link";
import { SideBarMenu } from "../../lib/NavsAndLinks";
import { usePathname } from "next/navigation";
import WalletButton from "@/components/walletButton";

const SideBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="py-10">
      <nav className="flex flex-col gap-y-[30px]">
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
        <WalletButton />
      </nav>
    </div>
  );
};

export default SideBar;
