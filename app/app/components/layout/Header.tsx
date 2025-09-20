import WalletBalance from "../WalletBalance";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  return (
    <header className="bg-white w-full flex justify-center items-center h-[80px] py-2 px-[25px]">
      <main className="h-full flex justify-between w-full items-center gap-10">
        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="flex items-center gap-10">
          <WalletBalance />
        </div>
      </main>
    </header>
  );
};

export default Header;
