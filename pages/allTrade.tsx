import React, { useState } from "react";
import { TradeType } from "@/sampleData/data";
import CardContainer2 from "@/components/cards/cardContainer2";
import { TradeData } from "@/sampleData/data";

export default function AllTrade() {
  const [view, setView] = useState(true);
  console.log(view);
  return (
    <div className="flex flex-col">
      <header className="">
        <div className="grid grid-cols-2">
          <div className="grid gap-x-2 grid-cols-3">
            {/* <div className="my-auto">
              <h1>Trades</h1>
            </div>
            <div>
              <DropdownInput options={TradeType} />
            </div> */}
            <button type="button" onClick={() => setView(!view)}>
              Check
            </button>
          </div>
          <div>
            <button className="flex items-center bg-transparent hover:bg-gray-100 hover:text-gray-900 text-gray-100 font-medium py-2 px-4 border border-gray-300 rounded-md">
              Filter
            </button>
          </div>
        </div>
      </header>
      <div
        className={`w-full ${
          view
            ? "grid justify-center self-center grid-cols-2 gap-y-4 gap-x-8"
            : ""
        }
      `}
      >
        {TradeData.map((trade, index) => (
          <div className="self-center" key={index}>
            <CardContainer2
              key={index}
              viewStyle={view}
              sampleData={trade.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
