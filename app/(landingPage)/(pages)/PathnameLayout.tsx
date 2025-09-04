"use client";

import { usePathname } from "next/navigation";
import { Header, Footer } from "../components";

export default function PathnameLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide header/footer on terms-and-conditions
  if (pathname === "/terms-and-conditions") {
    return <div>{children}</div>;
  }

  return (
    <div>
      <Header isGlobal={true} />
      {children}
      <Footer />
    </div>
  );
}
