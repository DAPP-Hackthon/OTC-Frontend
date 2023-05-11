import React, { useState } from "react";
import { TradeType } from "@/sampleData/data";
import CardContainer2 from "@/components/cards/cardContainer2";
import { TradeData } from "@/sampleData/data";
import Image from "next/image";
import { TiFilter } from "react-icons/ti";
import { HiViewGrid, HiViewList } from "react-icons/hi";

export default function AllTrade() {
  const [view, setView] = useState(true);

  const [selectedTrade, setSelectedTrade] = useState<string | null>(
    "All Trades"
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [tradeTypeFilter, setTradeTypeFilter] = useState(TradeData);

  const handleFilter = (tradeType: string, tradeLabel: string) => {
    console.log(tradeType);
    setSelectedTrade(tradeType);
    if (tradeType === "All") {
      setSelectedTrade("All Trades");
      setTradeTypeFilter(TradeData);
    } else {
      const filterByTradeType = TradeData.filter(
        (index) => index.tradeType === `${tradeType}`
      );
      setTradeTypeFilter(filterByTradeType);
      setSelectedTrade(tradeLabel);
    }
    console.log(tradeTypeFilter);
    // setIsOpen1(false);
  };
  const handleSelectOption = (option: string) => {
    setSelectedDate(option);
    setIsOpen(false);
  };
  const dateOption = [
    { value: "0", label: "1 Day" },
    { value: "1", label: "1 Week" },
    { value: "2", label: "1 Month" },
    { value: "3", label: "1 Year" },
  ];
  const tradeOption = [
    { value: "All", label: "All Trades" },
    { value: "direct", label: "Direct Trades" },
    { value: "fractional", label: "Fractional Trades" },
    { value: "otc", label: "OTC Pairs" },
  ];
  const mainTradeOption = [
    { value: "direct", label: "Direct Trades" },
    { value: "fractional", label: "Fractional Trades" },
    { value: "otc", label: "OTC Pairs" },
  ];
  console.log(view);
  return (
    <div className="flex flex-col xl:px-[8rem] lg:px-[8rem] md:px-[6rem] sm:px-[6rem] px-[2rem] ">
      <header className="">
        <div className="flex justify-between">
          <div className="flex gap-x-8 ">
            <h1 className="text-3xl w-fit self-center font-semibold">Trades</h1>
            <div className="self-center">
              <div className="relative">
                {/* Trade Dropdown */}
                <button
                  type="button"
                  className={`text-sm mt-2 z-50 w-full h-[3rem] flex items-center justify-between rounded-2xl  bg-white/20 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none`}
                  onClick={() => setIsOpen1(!isOpen1)}
                >
                  {selectedTrade ? (
                    <span className="block truncate">{selectedTrade}</span>
                  ) : (
                    <span className="block text-gray-400">
                      Select an option
                    </span>
                  )}

                  <Image
                    src="/down.png" // change this later on
                    alt="expert-image!"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className={`w-[1rem] transform transition-transform duration-200 ${
                      isOpen1 ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                {isOpen1 && (
                  <ul className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
                    {tradeOption.map((option) => (
                      <li
                        key={option.value}
                        className="text-sm cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() =>
                          handleFilter(`${option.value}`, `${option.label}`)
                        }
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {/* <div className="bg-[#004A3D] rounded-xl"> */}
            <button
              className="col-span-1"
              type="button"
              onClick={() => setView(!view)}
            >
              {view ? (
                <HiViewGrid className="text-3xl transition-all hover:opacity-1" />
              ) : (
                <HiViewList className="text-3xl transition-all hover:opacity-1" />
              )}
            </button>
            {/* </div> */}
          </div>
          <div className="self-end">
            <button className="flex items-center bg-[#004A3D] hover:bg-opacity-50 text-[#00FFB2] font-medium py-2 px-8 rounded-xl justify-self-end">
              <TiFilter className="text-xl text-[#00FFB2]" />
              Filter
            </button>
          </div>
        </div>
      </header>
      {selectedTrade === "All Trades" ? (
        mainTradeOption.map((trade, index) => (
          <div key={index}>
            <div>
              <h1 className="font-medium mb-2 text-xl">{trade.label}</h1>
              <div className="flex bg-[#004A3D] items-center rounded-full py-2 px-4 w-fit">
                <p className="whitespace-nowrap">Time Interval</p>
                <div className="relative flex items-center">
                  <button
                    type="button"
                    className={`text-sm z-50 ml-2 flex items-center justify-between rounded-2xl px-4 text-white focus:border-indigo-500 focus:outline-none`}
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {selectedDate ? (
                      <p className="whitespace-nowrap text-base text-[#00FFB2] font-medium ">
                        {selectedDate}
                      </p>
                    ) : (
                      ""
                    )}

                    <Image
                      src="/down.png" // change this later on
                      alt="down-arrow!"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className={`w-[1rem] ml-2 transform transition-transform duration-200 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <ul className="absolute w-[5rem] top-0 mt-8 ml-2 z-50  rounded-md border border-gray-300 bg-white shadow-lg">
                      {dateOption.map((option) => (
                        <li
                          key={option.value}
                          className="text-sm rounded-md cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => handleSelectOption(`${option.label}`)}
                        >
                          {option.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`w-full ${
                view ? "w-full flex flex-wrap gap-x-4 justify-between" : ""
              }
      `}
            >
              {TradeData.filter(index => index.tradeType===trade.value).map((trade, index) => (
                <div className="self-center " key={index}>
                  <CardContainer2
                    key={index}
                    viewStyle={view}
                    sampleData={trade.name}
                  />
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div>
          <div>
            <h1 className="font-medium mb-2 text-xl">{selectedTrade}</h1>
            <div className="flex bg-[#004A3D] items-center rounded-full py-2 px-4 w-fit">
              <p className="whitespace-nowrap">Time Interval</p>
              <div className="relative flex items-center">
                <button
                  type="button"
                  className={`text-sm z-50 ml-2 flex items-center justify-between rounded-2xl px-4 text-white focus:border-indigo-500 focus:outline-none`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {selectedDate ? (
                    <p className="whitespace-nowrap text-base text-[#00FFB2] font-medium ">
                      {selectedDate}
                    </p>
                  ) : (
                    ""
                  )}

                  <Image
                    src="/down.png" // change this later on
                    alt="down-arrow!"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className={`w-[1rem] ml-2 transform transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                {isOpen && (
                  <ul className="absolute w-[5rem] top-0 mt-8 ml-2 z-50  rounded-md border border-gray-300 bg-white shadow-lg">
                    {dateOption.map((option) => (
                      <li
                        key={option.value}
                        className="text-sm rounded-md cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => handleSelectOption(`${option.label}`)}
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div
            className={`w-full ${
              view ? "w-full flex flex-wrap gap-x-4 justify-between" : ""
            }
      `}
          >
            {tradeTypeFilter.map((trade, index) => (
              <div className="self-center " key={index}>
                <CardContainer2
                  key={index}
                  viewStyle={view}
                  sampleData={trade.name}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
