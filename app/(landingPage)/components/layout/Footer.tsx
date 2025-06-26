

import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FaDiscord, FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  const sections = [
    {
      title: "Resources",
      links: [
        { label: "Home", path: "/" },
        { label: "About us", path: "" },
        { label: "How it works", path: "/how-it-works" },
        { label: "FAQs", path: "" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Developers", path: "/developers" },
        { label: "How it works", path: "" },
        { label: "FAQs", path: "" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Privacy policies", path: "" },
        { label: "Term of Use", path: "" },
        { label: "Contact", path: "" },
      ],
    },
  ];

  const socialIcons = [
    { icon: FaDiscord, label: "Discord", path: "https://discord.com" },
    { icon: FaSquareXTwitter, label: "Twitter", path: "https://twitter.com" },
    { icon: FaGithub, label: "GitHub", path: "https://github.com" },
  ];

  return (
    <footer className="pt-16 pb-4 bg-[#003CB1] bg-[url(/LandingPage/FooterBg.png)] bg-fit bg-no-repeat bg-center text-white">
      <div className="flex flex-col max-w-screen-2xl w-full gap-8 px-4 mx-auto  md:flex-row lg:px-10">
        <div className="md:w-[55%]">
          {/* <Link href="/">
            <img src={logo} alt="logo" width={0} height={0} className="w-[50%]" />
          </Link> */}
          <p className="max-w-md mb-4 text-sm">
            DAOit is a decentralized governance platform designed for
            educational institutions, leveraging blockchain technology to
            facilitate democratic decision-making, financial inclusion, and
            collaborative learning.
          </p>
          <div className="flex space-x-4">
            {socialIcons.map(({ icon: Icon, label, path }) => (
              <a
                key={label}
                href={path}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-xl hover:text-black"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:gap-20 md:w-[45%]">
          {sections.map((section) => (
            <div key={section.title} className="flex-1">
              <h3 className="mb-4 font-bold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(({ label, path }) => (
                  <li key={label}>
                    <Link
                      href={path}
                      className="text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 mt-8 max-w-screen-2xl text-sm text-[#F2F2F2] lg:px-10">
        All rights reserved © DAOit
      </div>
    </footer>
  );
};

export default Footer;