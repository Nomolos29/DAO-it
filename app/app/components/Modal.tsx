import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  bgBlured?: boolean;
  bgDarkened?: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, bgBlured, bgDarkened, children }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div
      className={`fixed inset-0 ${bgDarkened && "bg-black/30"} ${bgBlured && "bg-white/70 backdrop-blur-[10px]"} flex justify-center items-center z-50`}
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className={`relative bg-white p-[30px] rounded-lg ${bgDarkened && "shadow-lg"} ${bgBlured && "border-[#ABABABB2] border"}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Close Icon (X) */}
        <button
          type="button"
          className="absolute top-3 right-3 bg-[#d3d3d3] w-5 h-5 flex justify-center items-center rounded-full text-white font-semibold border-none text-lg cursor-pointer"
          onClick={onClose}
        >
          ×
        </button>

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;