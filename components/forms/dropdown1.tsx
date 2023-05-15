import { useState } from "react";

type Option = {
  value: string;
  label: string;
};

type ButtonSelectProps = {
  options: Option[];
  onSelect: (selectedOption: Option) => void;
  className?: string;
};

const DropdownInput1 = ({ options, onSelect, className }: ButtonSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleSelectOption = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onSelect(option);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className={`w-full bg-gray-800 text-white px-4 py-2 rounded-md ${className}`}
        onClick={toggleDropdown}
      >
        {selectedOption ? selectedOption.label : "Select an option"}
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full bg-black rounded-md shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectOption(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default DropdownInput1

