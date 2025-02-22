const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  color = "bg-white text-black",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`${color} rounded-lg shadow-lg w-96 p-2`}>
        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
          <h3 className="text-lg font-semibold flex-1 text-center">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 ml-4"
          >
            ✖️
          </button>
        </div>
        <div className="p-4 bg-black">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
