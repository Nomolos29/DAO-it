import WalletBalance from "../WalletBalance";

const Header = () => {
  return (
    <header className="bg-white w-full flex justify-center items-center h-[80px] py-2 px-[25px]">
      <main className="h-full flex justify-end w-full items-center gap-10">
        <WalletBalance />
      </main>
    </header>
  );
};

export default Header;
