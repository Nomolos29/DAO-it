"use client"

import Link from "next/link";
import { SideBarMenu } from "../../lib/NavsAndLinks";
import { usePathname } from "next/navigation";
import WalletButton from "@/components/walletButton";
import { RiSettings3Line } from "react-icons/ri";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useState } from "react";
import { useActiveWallet, useDisconnect } from "thirdweb/react";

interface SideBarProps {
  isConnected: boolean;
}

const SideBar: React.FC<SideBarProps> = ({isConnected}) => {
  const pathname = usePathname();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const {disconnect }= useDisconnect();
  const wallet = useActiveWallet()

  const handleDisconnect = () => {
    if(wallet && wallet.id) {
       disconnect(wallet);
    }
   
  };

  return (
    <div className="max-h-[100vh] h-full bg-white w-[240px] overflow-hidden py-[25px] px-[20px]">
      <nav className="flex flex-col justify-between h-full relative">
        <div className="flex flex-col gap-y-10">
          <svg width="180" height="39" viewBox="0 0 180 39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_241_2776)">
            <path d="M7.61714 4.58789C5.66596 4.92187 4.00776 5.77148 2.64253 7.14258C1.47651 8.30859 0.662058 9.72656 0.263621 11.2969C-0.111379 12.7559 -0.0879418 14.6602 0.322214 16.043C0.486277 16.5996 0.790964 17.332 0.855417 17.332C0.884714 17.332 1.00776 17.2383 1.11909 17.1211C1.42964 16.793 2.36714 16.0605 2.92378 15.709C4.30073 14.8359 5.86518 14.2559 7.44721 14.0273C8.26167 13.9043 9.8437 13.9043 10.6582 14.0273C12.9667 14.3613 15.1113 15.3809 16.8398 16.9629C17.0625 17.168 17.2617 17.332 17.2851 17.332C17.3437 17.332 17.6542 16.541 17.8066 16.0137C18.1113 14.9414 18.2226 13.2656 18.0527 12.2344C17.7656 10.459 17.0683 8.93555 15.9199 7.59961C14.5371 5.98242 12.5273 4.89258 10.33 4.56445C9.77339 4.48242 8.16792 4.49414 7.61714 4.58789Z" fill="#1D54E1"/>
            <path d="M19.3945 4.61131C18.4922 4.77537 17.168 5.21483 17.168 5.35545C17.168 5.38475 17.2617 5.5078 17.3789 5.61912C17.707 5.92967 18.4395 6.86717 18.791 7.42381C19.6641 8.80076 20.2441 10.3652 20.4727 11.9472C20.5957 12.7617 20.5957 14.3437 20.4727 15.1582C20.1387 17.4668 19.1191 19.6113 17.5371 21.3398C17.332 21.5625 17.168 21.7617 17.168 21.7851C17.168 21.8437 17.959 22.1543 18.4863 22.3066C19.5586 22.6113 21.2344 22.7226 22.2656 22.5527C24.041 22.2656 25.5645 21.5683 26.9004 20.4199C28.5176 19.0371 29.6074 17.0273 29.9355 14.8301C30.082 13.8633 29.9941 12.3047 29.7363 11.2969C28.9277 8.11522 26.3848 5.57225 23.2031 4.76365C22.0957 4.4824 20.4785 4.41795 19.3945 4.61131Z" fill="#1D54E1"/>
            <path d="M8.46677 16.371C6.32224 16.5702 4.64059 17.2616 3.09958 18.58C1.48239 19.9628 0.392548 21.9726 0.0644227 24.1699C-0.0820616 25.1366 0.00582899 26.6952 0.263641 27.7031C1.07224 30.8847 3.6152 33.4277 6.79684 34.2363C8.25583 34.6113 10.1601 34.5878 11.5429 34.1777C12.0996 34.0136 12.832 33.7089 12.832 33.6445C12.832 33.6152 12.7383 33.4921 12.6211 33.3808C12.2929 33.0702 11.5605 32.1327 11.209 31.5761C10.3359 30.1991 9.75583 28.6347 9.52731 27.0527C9.40427 26.2382 9.40427 24.6562 9.52731 23.8417C9.8613 21.5331 10.8808 19.3886 12.4629 17.6601C12.6679 17.4374 12.832 17.2382 12.832 17.2148C12.832 17.1562 12.041 16.8456 11.5136 16.6933C10.6875 16.4589 9.21677 16.3007 8.46677 16.371Z" fill="#1D54E1"/>
            <path d="M12.4922 22.1192C12.0527 23.2266 11.8828 24.1641 11.8769 25.418C11.8711 26.3614 11.9355 26.877 12.1348 27.6739C12.4922 29.0625 13.1309 30.2871 14.0801 31.4004C15.4629 33.0176 17.4727 34.1075 19.6699 34.4356C20.6367 34.5821 22.1953 34.4942 23.2031 34.2364C26.3848 33.4278 28.9277 30.8848 29.7363 27.7032C30.1113 26.2442 30.0879 24.3399 29.6777 22.9571C29.5137 22.4004 29.209 21.668 29.1445 21.668C29.1152 21.668 28.9922 21.7617 28.8809 21.8789C28.5703 22.2071 27.6328 22.9395 27.0762 23.291C25.6992 24.1641 24.1348 24.7442 22.5527 24.9727C21.7383 25.0957 20.1562 25.0957 19.3418 24.9727C17.0332 24.6387 14.8887 23.6192 13.1602 22.0371C12.9375 21.8321 12.7383 21.668 12.7148 21.668C12.6914 21.668 12.5859 21.8731 12.4922 22.1192Z" fill="#1D54E1"/>
            </g>
            <path d="M48.294 11.488C51.4487 11.488 53.8753 12.294 55.574 13.906C57.2727 15.5007 58.122 17.78 58.122 20.744C58.122 23.708 57.2727 25.996 55.574 27.608C53.8753 29.2027 51.4487 30 48.294 30H42.132V11.488H48.294ZM45.928 26.724H48.242C50.2353 26.724 51.7173 26.23 52.688 25.242C53.676 24.254 54.17 22.7547 54.17 20.744C54.17 18.7333 53.676 17.234 52.688 16.246C51.7173 15.258 50.2353 14.764 48.242 14.764H45.928V26.724ZM63.9208 25.476L62.4648 30H58.4608L64.8828 11.488H70.0308L76.4528 30H72.4488L71.0188 25.476H63.9208ZM69.5888 20.978C68.7395 18.274 68.0375 15.8647 67.4828 13.75H67.4308C66.7895 16.1767 66.0961 18.586 65.3508 20.978L64.9608 22.2H69.9788L69.5888 20.978ZM85.5502 11.072C87.3528 11.072 88.9128 11.462 90.2302 12.242C91.5475 13.022 92.5528 14.14 93.2462 15.596C93.9568 17.0347 94.3122 18.7507 94.3122 20.744C94.3122 22.7373 93.9568 24.462 93.2462 25.918C92.5528 27.3567 91.5475 28.466 90.2302 29.246C88.9128 30.026 87.3528 30.416 85.5502 30.416C83.7475 30.416 82.1875 30.026 80.8702 29.246C79.5528 28.466 78.5388 27.3567 77.8282 25.918C77.1348 24.462 76.7882 22.7373 76.7882 20.744C76.7882 18.7507 77.1348 17.0347 77.8282 15.596C78.5388 14.14 79.5528 13.022 80.8702 12.242C82.1875 11.462 83.7475 11.072 85.5502 11.072ZM85.5502 14.452C84.0595 14.452 82.8808 15.0153 82.0142 16.142C81.1648 17.2513 80.7402 18.7853 80.7402 20.744C80.7402 22.7027 81.1648 24.2453 82.0142 25.372C82.8808 26.4813 84.0595 27.036 85.5502 27.036C87.0408 27.036 88.2108 26.4813 89.0602 25.372C89.9268 24.2453 90.3602 22.7027 90.3602 20.744C90.3602 18.7853 89.9268 17.2513 89.0602 16.142C88.2108 15.0153 87.0408 14.452 85.5502 14.452ZM97.0434 30V16.792H100.683V30H97.0434ZM97.0434 14.608V11.488H100.683V14.608H97.0434ZM110.157 27.27C110.521 27.27 110.833 27.2267 111.093 27.14V29.922C110.538 30.0953 109.897 30.182 109.169 30.182C107.644 30.182 106.534 29.8527 105.841 29.194C105.148 28.518 104.801 27.4173 104.801 25.892V19.496H102.669V16.792H104.801V13.36H108.441V16.792H110.963V19.496H108.441V25.242C108.441 25.97 108.571 26.49 108.831 26.802C109.091 27.114 109.533 27.27 110.157 27.27Z" fill="#1D54E1"/>
            <defs>
            <clipPath id="clip0_241_2776">
            <rect width="30" height="30" fill="white" transform="translate(0 4.5)"/>
            </clipPath>
            </defs>
          </svg>

          <div className="flex flex-col gap-y-[15px]">
            {SideBarMenu.map((navItem, index) => (
              <Link
                key={index}
                href={navItem.navLink}
                className={`flex items-center gap-x-3 ${
                  pathname === navItem.navLink
                    ? "font-semibold bg-[#1D54E1] text-white"
                    : "hover:bg-[#1d55e173] hover:text-white"
                } group h-[50px] rounded-[10px] pl-[15px] pr-[10px] transition-colors duration-200`}
              >
                <span className="text-xl">
                  <navItem.navIcon />
                </span>
                <span className="group-hover:font-medium text-md                                                                                                                                                                                    ">
                  {navItem.navTitle}
                </span>
              </Link>
            ))}
          </div>
        </div>
        
        <div className={`flex flex-col gap-y-3 bg-white w-full overflow-hidden z-10 absolute bottom-0 left-0 ${showProfileMenu ? "translate-y-0" : "translate-y-[60%]"} transition-all duration-500`}>
          <div className="flex w-full justify-end">
            <IoIosArrowDropdownCircle className={`text-3xl text-[#1D54E15A] hover:text-[#1D54E1] cursor-pointer transition-all duration-500 ${showProfileMenu ? "rotate-0" : "rotate-[180deg]"}`} onClick={() => setShowProfileMenu(!showProfileMenu)} />
          </div>
          <main className="flex flex-col gap-y-3 border-t border-[#EDEDED] pt-3">
            <WalletButton />

            <div className="flex flex-col gap-y-3">
              <Link href="#">
                <button type="button" className="flex items-center w-full gap-x-3 h-[50px] px-[20px] rounded-[10px] text-[#2E3035] font-semibold hover:bg-[#F7F3FF] hover:text-[#2E3035] transition-colors duration-200">
                  <RiSettings3Line className="text-xl" />
                  Settings
                </button>
              </Link>

              {isConnected && (
              <button type="button" className="flex items-center w-full gap-x-3 h-[50px] bg-[#A50D0D1A] px-[20px] rounded-[10px] text-[#A50D0D] font-medium text-md hover:bg-[#F7F3FF] hover:text-[#2E3035] transition-colors duration-200" onClick={handleDisconnect}>Log Out</button>)}
            </div>
          </main>
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
