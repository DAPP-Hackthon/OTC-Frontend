import React, { useState } from "react";
import CardContainer from "../../components/cards/cardContainer1";
import DropdownInput from "../../components/forms/dropdown";
import { InputField } from "../../components/forms/inputField";
import { Button } from "../../components/buttons/button";
import Image from "next/image";
import { useRouter } from "next/router";
import { TradeType } from "@/sampleData/data";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const FractionalTrade = ({ children, className = "", onClick }: CardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const handleSelectOption = (option: string, value: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    router.push(`/tradeType/${value}`);
  };
  const option1 = [
    { value: 0, label: 0 },
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
  ];
  const option2 = [
    { value: 0, label: 0 },
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
  ];
  return (
    <div className="h-screen">
      {/* <div className="flex justify-center w-full text-center gap-6 mb-6">
        <h1 className="mt-4">Trade / Swap</h1>
        <div className="relative">
          <button
            type="button"
            className="text-sm mt-2 z-50 w-full h-[3rem] flex items-center justify-between rounded-2xl  bg-white/20 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
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
            <ul className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
              {TradeType.map((option) => (
                <li
                  key={option.value}
                  className="text-sm cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => handleSelectOption(option.label, option.value)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <CardContainer className="mb-4 ">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
          <div className="col-span-1 md:col-span-5 rounded-md">
            <DropdownInput label="Type of Trade" options={option2} />
          </div>
          <div className="col-span-1 md:col-span-5 rounded-md">
            <DropdownInput label="Visibility" options={option2} />
          </div>
        </div>
      </CardContainer>

      <div className="flex">
        <CardContainer balance={24} className="mr-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
            <div className="col-span-1 md:col-span-5 rounded-md">
              <InputField
                label="You Give"
                name="send"
                placeholder="Enter details..."
              />
            </div>
            <div className="col-span-1 md:col-span-5 rounded-md">
              <DropdownInput label="Your Assets" options={option2} />
            </div>
          </div>
        </CardContainer>
        <button type="button" className="flex items-center">
          <svg
            width="50px"
            height="50px"
            viewBox="0 0 24 24"
            className="white"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.293 1.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L16 4.414V14a1 1 0 1 1-2 0V4.414l-2.293 2.293a1 1 0 1 1-1.414-1.414l4-4ZM10 10a1 1 0 1 0-2 0v9.586l-2.293-2.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L10 19.586V10Z"
              fill="#ffffff"
            />
          </svg>
        </button>
        <CardContainer className="ml-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
            <div className="col-span-1 md:col-span-5 rounded-md">
              <InputField
                label="You Receive"
                name="title"
                placeholder="Enter details..."
              />
            </div>
            <div className="col-span-1 md:col-span-5 rounded-md">
              <DropdownInput label="Your Partners Assets" options={option2} />
            </div>
          </div>
        </CardContainer>
      </div>
      <div className="w-full flex justify-center">
        <Button className="mt-5 max-w-[25rem] mx-auto" text={"Create Trade"} />
      </div> */}
    </div>
  );
};

export default FractionalTrade;
