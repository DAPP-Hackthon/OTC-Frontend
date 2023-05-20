import React, { useState } from "react";
import CardContainer3 from "@/components/cards/cardContainer3";
import { Button } from "@/components/buttons/button";
import { useRouter } from "next/router";
import { TradeType } from "@/sampleData/data";
import Image from "next/image";

export default function MyTrade() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectOption = (option: string, value: string) => {
    setSelectedOption(option);
    setSelectedRoute(value);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-[70%]">
        <div className="flex justify-between mb-8">
          <h2 className="my-auto font-medium font-poppins text-sm xs:text-base sm:text-xl  2xl:text-[1.5rem] 3xl:text-4xlxl 4xl:text-6xl leading-4 sm:leading-6 lg-leading-tight 3xl:leading-normal 4xl:leading-normal ">My Trades</h2>
          <div className="relative w-[12rem] 3xl:w-fit">
            
            <button
              type="button"
              className="text-sm mt-2 z-50 w-full h-[3rem] 3xl:h-[6rem] 4xl:h-[9rem] flex items-center justify-between rounded-2xl 3xl:rounded-[1.5rem] 4xl:rounded-[2rem]  bg-[#004A3D] px-4 py-2  3xl:px-10 3xl:py-10 4xl:px-16 4xl:py-16 text-white focus:border-indigo-500 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {selectedOption ? (
                <span className="block truncate whitespace-nowrap 2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl">{selectedOption}</span>
              ) : (
                <span className="block whitespace-nowrap 2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl text-gray-400">Select an option</span>
              )}

              <Image
                src="/down.png" // change this later on
                alt="expert-image!"
                width="0"
                height="0"
                sizes="100vw"
                className={`ml-4 3xl:ml-12 w-[1rem] 3xl:w-[2rem] 4xl:w-[3rem] transform transition-transform duration-200 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            {isOpen && (
              <ul className="absolute z-50 mt-1 w-full rounded-2xl 3xl:rounded-[1.5rem] 4xl:rounded-[2rem] border border-gray-300 bg-white shadow-lg">
                {TradeType.map((option) => (
                  <li
                    key={option.value}
                    className="text-sm rounded-2xl 3xl:rounded-[1.5rem] 4xl:rounded-[2rem] 2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl cursor-pointer px-4 py-2 4xl:px-8 4xl:py-6 text-gray-700 hover:bg-gray-100"
                    onClick={() =>
                      handleSelectOption(option.label, option.value)
                    }
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <CardContainer3 className="text-center w-full">
          <p className="mb-4 3xl:mb-[2rem] 4xl:mb-[3rem] font-poppins text-xs xs:text-sm sm:text-xl md:text-lg xl:text-lg 2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl leading-4 sm:leading-6 lg-leading-tight 3xl:leading-normal 4xl:leading-normal ">You have not created any trade yet</p>
          <Button
            type="button"
            disabled={!selectedOption}
            text="Create New Trade"
            className="w-full 3xl:rounded-3xl 3xl:px-6 3xl:py-6 4xl:px-8 4xl:py-8  2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl "
            onClick={() => router.push(`/tradeType/${selectedRoute}`)}
          />
        </CardContainer3>
      </div>
    </div>
  );
}
