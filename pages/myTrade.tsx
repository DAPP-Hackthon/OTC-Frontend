import React, { useState, useEffect } from "react";
import CardContainer3 from "@/components/cards/cardContainer3";
import { Button } from "@/components/buttons/button";
import { useRouter } from "next/router";
import { TradeType } from "@/sampleData/data";
import Image from "next/image";
import axios from "axios"
import CardContainer2 from "@/components/cards/cardContainer2";
import { useAccount } from "wagmi";

export default function MyTrade() {
  interface Trade {
    _id: string;
    nonce:number;
    name: string;
    sourceChainId:number;
    destinationChainId:number;
    tradeType: string;
    sellAmount: number;
    buyAmount: number;
    maker: string;
    taker:string;
    tokenToSell: string;
    tokenToBuy: string;
    signature: string;
    ordertype: string;
    orderType:number;
    status: string;
  }
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedSwapOption, setSelectedSwapOption] = useState<string | null>(
    null
  );
  const { isConnected, address } = useAccount({
    onConnect({ address }) {
      if (!address) return;
      // handleTokens(address);
    },
  });
  console.log("address", address)
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [isSwapOpen, setSwapIsOpen] = useState(false);
  const [tradeData, setTradeData] = useState<Trade[] | null>(null);

  const swapType = [
    { value: "0", label: "Normal Swap" },
    { value: "1", label: "Cross Chain Swap" },
  ];
  const handleSwapOption = (option: string, value: string) => {
    setSelectedSwapOption(option);
    setSwapIsOpen(false);
  };

  console.log("selectedSwapOption", selectedSwapOption);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/otc/order/single-chain",
          {
            params: {
              pageNo: 1,
              pageSize:9999999999999,
            },
          }
        );
    
        setTradeData(response.data);
        // console.log(response.data)
        console.log("tradeData", tradeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    // const HandleBrowse =
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  },[]);
  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="w-full">
          <div className="flex mb-8">
            <h2 className="my-auto font-medium font-poppins text-sm xs:text-base sm:text-xl  2xl:text-[1.5rem] 3xl:text-4xlxl 4xl:text-6xl leading-4 sm:leading-6 lg-leading-tight 3xl:leading-normal 4xl:leading-normal ">
              My Trades
            </h2>
            <div className="flex gap-x-5 ml-auto">
              <div className="relative w-[12rem] 3xl:w-fit">
                <button
                  type="button"
                  className="text-sm mt-2 z-50 w-full h-[3rem] 3xl:h-[6rem] 4xl:h-[9rem] flex items-center justify-between rounded-2xl 3xl:rounded-[1.5rem] 4xl:rounded-[2rem]  bg-[#00FFB2]/30 px-4 py-2  3xl:px-10 3xl:py-10 4xl:px-16 4xl:py-16 text-white focus:border-indigo-500 focus:outline-none"
                  onClick={() => setSwapIsOpen(!isSwapOpen)}
                >
                  {selectedSwapOption ? (
                    <span className="block truncate whitespace-nowrap 2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl">
                      {selectedSwapOption}
                    </span>
                  ) : (
                    <span className="block whitespace-nowrap 2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl text-gray-400">
                      Select Swap Type
                    </span>
                  )}

                  <Image
                    src="/down.png" // change this later on
                    alt="expert-image!"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className={`ml-4 3xl:ml-12 w-[1rem] 3xl:w-[2rem] 4xl:w-[3rem] transform transition-transform duration-200 ${
                      isSwapOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                {isSwapOpen && (
                  <ul className="absolute z-50 mt-1 w-full rounded-2xl 3xl:rounded-[1.5rem] 4xl:rounded-[2rem] border border-gray-300 bg-white shadow-lg">
                    {swapType.map((option) => (
                      <li
                        key={option.value}
                        className="text-sm rounded-2xl 3xl:rounded-[1.5rem] 4xl:rounded-[2rem] 2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl cursor-pointer px-4 py-2 4xl:px-8 4xl:py-6 text-gray-700 hover:bg-gray-100"
                        onClick={() =>
                          handleSwapOption(option.label, option.value)
                        }
                      >
                        {option.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {selectedSwapOption === "Normal Swap" ? (
                <div className="relative w-[12rem] 3xl:w-fit">
                  <button
                    type="button"
                    className="text-sm mt-2 z-50 w-full h-[3rem] 3xl:h-[6rem] 4xl:h-[9rem] flex items-center justify-between rounded-2xl 3xl:rounded-[1.5rem] 4xl:rounded-[2rem]  bg-[#00FFB2]/30 px-4 py-2  3xl:px-10 3xl:py-10 4xl:px-16 4xl:py-16 text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <span className="block truncate whitespace-nowrap 2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl">
                      Direct Trade
                    </span>
                  </button>
                </div>
              ) : (
                // <div className="relative w-[12rem] 3xl:w-fit">
                //   <button
                //     type="button"
                //     className="text-sm mt-2 z-50 w-full h-[3rem] 3xl:h-[6rem] 4xl:h-[9rem] flex items-center justify-between rounded-2xl 3xl:rounded-[1.5rem] 4xl:rounded-[2rem]  bg-[#00FFB2]/30 px-4 py-2  3xl:px-10 3xl:py-10 4xl:px-16 4xl:py-16 text-white focus:border-indigo-500 focus:outline-none"
                //     onClick={() => setIsOpen(!isOpen)}
                //   >
                //     {selectedOption ? (
                //       <span className="block truncate whitespace-nowrap 2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl">
                //         {selectedOption}
                //       </span>
                //     ) : (
                //       <span className="block whitespace-nowrap 2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl text-gray-400">
                //         Select Trade Type
                //       </span>
                //     )}

                //     <Image
                //       src="/down.png" // change this later on
                //       alt="expert-image!"
                //       width="0"
                //       height="0"
                //       sizes="100vw"
                //       className={`ml-4 3xl:ml-12 w-[1rem] 3xl:w-[2rem] 4xl:w-[3rem] transform transition-transform duration-200 ${
                //         isOpen ? "rotate-180" : "rotate-0"
                //       }`}
                //     />
                //   </button>
                //   {isOpen && (
                //     <ul className="absolute z-50 mt-1 w-full rounded-2xl 3xl:rounded-[1.5rem] 4xl:rounded-[2rem] border border-gray-300 bg-white shadow-lg">
                //       {TradeType.map((option) => (
                //         <li
                //           key={option.value}
                //           className="text-sm rounded-2xl 3xl:rounded-[1.5rem] 4xl:rounded-[2rem] 2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl cursor-pointer px-4 py-2 4xl:px-8 4xl:py-6 text-gray-700 hover:bg-gray-100"
                //           onClick={() =>
                //             handleSelectOption(option.label, option.value)
                //           }
                //         >
                //           {option.label}
                //         </li>
                //       ))}
                //     </ul>
                //   )}
                // </div>
                ""
              )}
            </div>
          </div>

          <CardContainer3 className="text-center w-full">
            <p className="mb-4 3xl:mb-[2rem] 4xl:mb-[3rem] font-poppins text-xs xs:text-sm sm:text-xl md:text-lg xl:text-lg 2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl leading-4 sm:leading-6 lg-leading-tight 3xl:leading-normal 4xl:leading-normal ">
              You have not created any trade yet
            </p>
            <Button
              type="button"
              disabled={!selectedOption}
              text="Create New Trade"
              className={`w-full 3xl:rounded-3xl 3xl:px-6 3xl:py-6 4xl:px-8 4xl:py-8  2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl ${
                !selectedOption
                  ? "opacity-50 cursor-not-allowed hover:scale-100 hover:bg-[#00FFB2]"
                  : ""
              }`}
              onClick={() => router.push(`/tradeType/${selectedRoute}`)}
            />
          </CardContainer3>
        </div>
      </div>
      <div className="mt-[5%]">
        <h1 className="font-medium font-poppins text-sm xs:text-base sm:text-xl  2xl:text-[1.5rem] 3xl:text-4xlxl 4xl:text-6xl leading-4 sm:leading-6 lg-leading-tight 3xl:leading-normal 4xl:leading-normal ">Trades Requested By You</h1>
        <div
          className={`w-full mt-[1%] flex flex-wrap gap-x-[2rem]`}
        >
          {/* {TradeData.filter((index) => index.tradeType === trade.value).map( */}
          {tradeData &&
            tradeData.filter((index)=> index.taker === `0x9b88c6cc678478cfd70b00f979543c4cf2922043`).map((trade, index) => (
              <div className="self-center cursor-pointer" key={index}>
            
                <CardContainer2
                  key={trade._id}
                  chainId={trade.sourceChainId}
                  sellAmount={trade.sellAmount}
                  buyAmount={trade.buyAmount}
                  viewStyle={true}
                  receivedFrom={trade.maker}
                />
              </div>
            ))}
        </div> 
        {/* </div> */}
      </div>
      <div className="mt-[3%]">
        <h1 className="font-medium font-poppins text-sm xs:text-base sm:text-xl  2xl:text-[1.5rem] 3xl:text-4xlxl 4xl:text-6xl leading-4 sm:leading-6 lg-leading-tight 3xl:leading-normal 4xl:leading-normal ">Incoming Trade Requests</h1>
        <div
          className={`w-full mt-[1%] flex flex-wrap gap-x-[2rem]`}
        >
          {/* {TradeData.filter((index) => index.tradeType === trade.value).map( */}
          {tradeData &&
            tradeData.filter((index)=> index.taker === `0x9b88c6cc678478cfd70b00f979543c4cf2922043`).map((trade, index) => (
              <div className="self-center cursor-pointer" key={index}>
            
                <CardContainer2
                  key={trade._id}
                  chainId={trade.sourceChainId}
                  sellAmount={trade.sellAmount}
                  buyAmount={trade.buyAmount}
                  viewStyle={true}
                  receivedFrom={trade.maker}
                />
              </div>
            ))}
        </div> 
        {/* </div> */}
      </div>
    </div>
  );
}
