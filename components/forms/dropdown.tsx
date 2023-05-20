import Image from "next/image";
import React, { useState } from "react";

interface Option {
  value: string | number;
  label: string | number;
}

interface DropdownInputProps {
  options: Option[];
  className?: string;
  label?: string;
  url?: string;
  name?: string;
  onChange?: (_event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const DropdownInput: React.FC<DropdownInputProps> = ({
  options,
  className,
  label,
  onChange,
  url,
  name,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative z-30">
      <label className="text-md mb-3">{label}</label>

      <button
        name={name}
        type="button"
        className={`text-sm mt-2 z-50 w-full h-[3rem] flex items-center justify-between rounded-2xl  bg-[#004A3D]/50 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none ${className}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? (
          <span className="block truncate">{selectedOption}</span>
        ) : (
          <span className="block text-gray-400">Select an option</span>
        )}

        <Image
          src="/down.png" // change this later on
          alt="expert-image!"
          width="0"
          height="0"
          sizes="100vw"
          className={`w-[1rem] transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {isOpen && (
        <ul className="absolute z-30 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              className="text-sm cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => handleSelectOption(`${option.label}`)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownInput;
