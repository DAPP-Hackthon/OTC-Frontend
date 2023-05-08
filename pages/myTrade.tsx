import React, { useState } from "react";
import CardContainer from "@/components/cards/cardContainer1";
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
    <div className="flex flex-col items-center h-screen">
      <div>
        <div className="grid grid-cols-2 mb-8">
          <h2 className="my-auto font-bold">My Trades</h2>
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

        <CardContainer className="text-center">
          <p className="mb-4">You have not created any trade yet</p>
          <Button
            type="button"
            disabled={!selectedOption}
            text="Create New Trade"
            onClick={() => router.push(`/tradeType/${selectedRoute}`)}
          />
        </CardContainer>
      </div>
    </div>
  );
}
