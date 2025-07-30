import React from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  bgBlured?: boolean;
  bgDarkened?: boolean;
  children?: React.ReactNode;
  closeButton?: "left" | "right";
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, bgBlured, bgDarkened, children, closeButton }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div
      className={`fixed inset-0 w-screen ${bgDarkened && "bg-black/30"} ${bgBlured && "bg-black/30 backdrop-blur-[10px]"} flex justify-center items-center z-50`}
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className={`relative bg-white p-[30px] rounded-lg ${bgDarkened && "shadow-lg"} ${bgBlured && "border-[#ABABABB2] border"}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Close Icon (X) */}
        {closeButton && <button
          type="button"
          className={`absolute top-3 bg-[#d3d3d3] w-7 h-7 flex justify-center items-center rounded-full text-white font-semibold border-none text-xl cursor-pointer ${closeButton === "left" ? "left-3" : "right-3"}`}
          onClick={onClose}
        >
          ×
        </button>}

        {/* Modal Content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;