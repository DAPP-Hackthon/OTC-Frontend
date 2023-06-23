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
      overlayClassName="absolute inset-0 bg-black/50 bg-opacity-20 transition-opacity"
      className="backdrop-blur-lg border border-[#A4A4A4] z-50 3xl:px-10 4xl:px-14 3xl:py-20 4xl:py-28  3xl:rounded-3xl absolute font-poppins w-[20rem] 2xl:w-[30rem] 3xl:w-[50rem] 4xl:w-[70rem] bg-[#003A30]/20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  rounded-lg overflow-hidden shadow-xl"
    >
      <div className="flex pt-[10%] justify-between p-4   ">
        <div className=" flex items-center font-semibold text-lg 3xl:text-4xl 4xl:text-5xl text-white">{title}</div>
        <div>
          <IoClose
            className="cursor-pointer text-[30px] 3xl:text-4xl 4xl:text-6xl text-white"
            onClick={handleExit}
          />
        </div>
      </div>

      {children}
    </Modal>
  );
};

export default CustomModal;
