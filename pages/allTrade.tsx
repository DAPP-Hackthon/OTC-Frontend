import React, { useState, useEffect } from "react";
import { TradeType } from "@/sampleData/data";
import CardContainer2 from "@/components/cards/cardContainer2";
import { TradeData } from "@/sampleData/data";
import Image from "next/image";
import { TiFilter } from "react-icons/ti";
import { HiViewGrid, HiViewList } from "react-icons/hi";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import contractABI from "@/sampleData/abi.json";
import axios from "axios";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";

const contractAddress = "0xa7664cAde798Ed669Ca06A2984854f126d1FFB6a";
// const contract = new web3.eth.Contract(contractABI, contractAddress);

export default function AllTrade() {
  interface Trade {
    _id: string;
    name: string;
    tradeType: string;
    sellAmount: number;
    buyAmount: number;
    maker: string;
    tokenToSell: string;
    tokenToBuy: string;
    signature: string;
    ordertype: string;
    status: string;
  }
  const [view, setView] = useState(true);
  const add = useAccount();
  // console.log("address", add)

  const [selectedTrade, setSelectedTrade] = useState<string | null>(
    "All Trades"
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [tradeData, setTradeData] = useState<Trade[] | null>(null);
  const [tradeTypeFilter, setTradeTypeFilter] = useState(TradeData);
  const [browseAll, setBrowseAll] = useState(false);
  const handleFilter = (tradeType: string, tradeLabel: string) => {
    // console.log(tradeType);
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
    // console.log(tradeTypeFilter);
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

  const { config, error } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "swapFullOrder",
    args: [
      1,
      "1",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      100,
      "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
      1009,
      "0x5d2bdcd95c1eaafd14cbf3d200f345122be27035136fcdd675a7415a7ea41b6b32cd015ea4b2a72d04e84d35f96bfd367188dca6e330212c2deeb61112e4df4e1b",
    ],
  });

  const {} = usePrepareContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "swapPrivateOrder",
    args: [
      1,
      "1",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      100,
      "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
      1009,
      "0x5d2bdcd95c1eaafd14cbf3d200f345122be27035136fcdd675a7415a7ea41b6b32cd015ea4b2a72d04e84d35f96bfd367188dca6e330212c2deeb61112e4df4e1b",
    ],
  });
  

  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  
  // console.log("error contract", error);
  // console.log("contractResult", data);

  //Calling getOrder Api
  // const countPageSize = () => {
  //   let count = 0;
  //   for (pageSize =0) {
  //     count++;
  //   }
  //   return count;
  // }
  
  const BrowseAll = (e: MouseEvent) =>{
    e.preventDefault()
    setBrowseAll(true)
    console.log(browseAll)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/otc/order/v1", {
          params: {
            pageNo: 1,
            pageSize: browseAll?8:4,
          },
        });
        
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
  }, [browseAll]);
  //fullOrderSwapfunction begins

  
  const handleFullOrderSwap = async (config: any): Promise<any> => {
    console.log("config", config)
    const hash = writeContract(config);
    console.log("hash", hash)
  };

  const handlePrivateOrderSwap = async (config: any): Promise<any> => {
    console.log("config", config)
    const hash = writeContract(config);
    console.log("hash", hash)
  };

  //swapPrivateOrder begins

  // const handleswapPrivateOrderSwap = (
  //   _id: string,
  //   maker: string,
  //   tokenToSell: string,
  //   sellAmount: number,
  //   tokenToBuy: string,
  //   buyAmount: number,
  //   signature: string,
  //   ordertype: string,
  //   status: string
  // ) => {
  //   console.log(
  //     maker,
  //     _id,
  //     tokenToSell,
  //     sellAmount,
  //     tokenToBuy,
  //     buyAmount,
  //     signature,
  //     ordertype,
  //     status
  //   );
  // };

  return (
    <div className="flex flex-col xl:px-[8rem] lg:px-[8rem] md:px-[6rem] sm:px-[6rem] px-[2rem] ">
      <header className="">
        <div className="flex justify-between">
          <div className="flex gap-x-8 ">
            <p className="cursor-pointer" onClick={() => write?.()}>
              Test
            </p>
            {isLoading && <div>Check Wallet</div>}
            {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
            <h1 className="text-3xl w-fit self-center font-semibold">Trades</h1>
            <div className="self-center">
              <div className="relative">
                {/* Trade Dropdown */}
                <button
                  type="button"
                  className={`text-sm mt-2 z-30 w-full h-[3rem] flex items-center justify-between rounded-2xl  bg-white/20 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none`}
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
                  <ul className="absolute z-40 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
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
      {/* {selectedTrade === "All Trades" ? (
        mainTradeOption.map((trade, index) => (
          <div key={index}>
            <div>
              <h1 className="font-medium mb-2 text-xl">{trade.label}</h1>
              <div className="flex bg-[#004A3D] items-center rounded-full py-2 px-4 w-fit">
                <p className="whitespace-nowrap">Time Interval</p>
                <div className="relative flex items-center">
                  <button
                    type="button"
                    className={`text-sm z-30 ml-2 flex items-center justify-between rounded-2xl px-4 text-white focus:border-indigo-500 focus:outline-none`}
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
                    <ul className="absolute w-[5rem] top-0 mt-8 ml-2 z-30  rounded-md border border-gray-300 bg-white shadow-lg">
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
              {TradeData.filter((index) => index.tradeType === trade.value).map(
                (trade, index) => (
                  <div className="self-center " key={index}>
                    <CardContainer2
                      key={index}
                      viewStyle={view}
                      sampleData={trade.name}
                    />
                  </div>
                )
              )}
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
                  className={`text-sm z-30 ml-2 flex items-center justify-between rounded-2xl px-4 text-white focus:border-indigo-500 focus:outline-none`}
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
                  <ul className="absolute w-[5rem] top-0 mt-8 ml-2 z-30  rounded-md border border-gray-300 bg-white shadow-lg">
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
      )} */}

      <div>
        <div>
          <h1 className="font-medium mb-2 text-xl">Direct Trade</h1>
          <div className="flex bg-[#004A3D] items-center rounded-full py-2 px-4 w-fit">
            <p className="whitespace-nowrap">Time Interval</p>
            <div className="relative flex items-center">
              <button
                type="button"
                className={`text-sm z-30 ml-2 flex items-center justify-between rounded-2xl px-4 text-white focus:border-indigo-500 focus:outline-none`}
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
                <ul className="absolute w-[5rem] top-0 mt-8 ml-2 z-30  rounded-md border border-gray-300 bg-white shadow-lg">
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
          {tradeData &&
            tradeData.map((trade, index) => (
              <div
                className="self-center "
                key={index}
              >
                <CardContainer2
                  key={trade._id}
                  // give={trade.}
                  // onClick={() =>
                  //   handleswapPrivateOrderSwap(
                  //     trade._id,
                  //     trade.maker,
                  //     trade.tokenToSell,
                  //     trade.sellAmount,
                  //     trade.tokenToBuy,
                  //     trade.buyAmount,
                  //     trade.signature,
                  //     trade.ordertype,
                  //     trade.status
                  //   )
                  // }
                  sellAmount={trade.sellAmount}
                  buyAmount={trade.buyAmount}
                  viewStyle={view}
                  sampleData={trade._id}
                />
                <div className="flex gap-x-4">
                <p
                  className="cursor-pointer"
                  onClick={() =>
                    handleFullOrderSwap({
                      address: contractAddress,
                      abi: contractABI,
                      functionName: "swapFullOrder",
                      args: [
                        1,
                        "1",
                        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
                        100,
                        "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
                        1009,
                        "0x5d2bdcd95c1eaafd14cbf3d200f345122be27035136fcdd675a7415a7ea41b6b32cd015ea4b2a72d04e84d35f96bfd367188dca6e330212c2deeb61112e4df4e1b",
                      ],
                    })
                  }
                >
                  Click Public {index}
                </p>
                <p>
                  Click Private {index}
                </p>
                </div>
              </div>
            ))}
            <div className="browse">
                  <button onClick={BrowseAll} >Browse</button>
                </div>
        </div>
      </div>
    </div>
  );
}
