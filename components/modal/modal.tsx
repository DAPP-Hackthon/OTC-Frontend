import React from "react";
import Modal from "react-modal";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onRequestClose: () => void;
  handleExit?: () => void;
}

const CustomModal: React.FC<ModalProps> = ({
  isOpen,
  onRequestClose,
  children,
  title,
  handleExit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="fixed inset-0 bg-black/50 bg-opacity-20 transition-opacity"
      className="3xl:p-8 3xl:rounded-3xl absolute font-poppins w-[25rem] 2xl:w-[30rem] 3xl:w-[55rem] 4xl:w-[70rem] bg-[#003A30] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  rounded-lg overflow-hidden shadow-xl"
    >
      <div className="flex justify-between p-4 ">
        <div className="font-semibold text-lg 3xl:text-4xl 4xl:text-5xl text-white">{title}</div>
        <div>
          <IoClose
            className="cursor-pointer text-[30px] 3xl:text-4xl 4xl:text-5xl text-white"
            onClick={handleExit}
          />
        </div>
      </div>

      {children}
    </Modal>
  );
};

export default CustomModal;
