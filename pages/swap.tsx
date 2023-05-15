import React from "react";
import SwapCard from "@/components/cards/swapCard";
import Image from "next/image";
import { TiFilter } from "react-icons/ti";

export default function Swap() {
  return (
    <div className="flex font-poppins flex-col xl:px-[8rem] lg:px-[8rem] md:px-[6rem] sm:px-[6rem] px-[2rem] ">
      <div className="bg-[#003A30] p-3 rounded-2xl">
        <div className="flex mb-4 justify-between">
          <div className="my-auto px-2 flex gap-10">
            <p className="text-[14px] self-center font-extralight">
              Select NFT you want to buy
            </p>
            <div className="relative flex h-[2.2rem]">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="simple-search"
                className="bg-[#004A3D] text-white text-sm rounded-full focus:outline-none focus:ring-blue-500  block w-full pl-10 p-2.5  "
                placeholder="Search"
                required
              />
            </div>
          </div>

          <button className="items-center text-[#00FFB2] font-medium  rounded-xl justify-self-end">
            <p className="flex text-sm items-center whitespace-nowrap ">
              <TiFilter className="text-lg text-[#00FFB2] " />
              Filter
            </p>
          </button>
        </div>
        <div className="my-3">
          <SwapCard
            title="NFT Name"
            imageUrl="data:image/jpeg;base64,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"
            description="nftName"
            buttonText="button"
          />
        </div>

      </div>
      <div className="mt-8">
          <div className="bg-[#003A30] font-poppins h-[12.5rem] w-[16rem] rounded-2xl shadow-md p-2">
            <p className="text-[12px] font-light mb-2 px-4">Select Token you want to buy from</p>
           

            <p className="text-[12px] font-light mb-2 px-4">Available Token : 0</p>
            
          </div>
        </div>
    </div>
  );
}
