import React, { useState } from "react";
import LandingCard1 from "@/components/cards/landingCard1";
import LandingCard2 from "@/components/cards/landingCard2";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-screen  ">
      <div
        className={
          "grid  xl:grid-cols-8 md:grid-cols-1 sm:grid-cols-1 grid-cols-1  gap-y-4 gap-x-8"
        }
      >
        <div className="2xl:col-span-5 xl:col-span-5 md:col-span-1 sm:col-span-1">
          <h1 className="text-4xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-7xl  font-bold custom-font">
            Seamless and Secure Cross Chain OTC Swaps
          </h1>

          <div className="grid text-xs sm:text-base md:text-base lg:text-base xl:text-base my-10 min-h-fit grid-cols-2 2xl:grid-cols-2 xl:grid-cols-2 md:grid-cols-2 gap-y-2 gap-x-8">
            <div className="block min-h-fit 2xl:block xl:block lg:block md:block">
              <Image
                src="/landing.png" // change this later on
                alt="cube"
                width="300"
                height="300"
                sizes="100vw"
              />
            </div>
            <div className="self-center ">
              <div className="grid 2xl:grid-cols-2 xl:grid-cols-2 gap-5 mb-5">
                <div className="flex items-center min-w-fit ">
                  <div className="hover:scale-125">
                    <Image
                      src="/av1.png" // change this later on
                      alt="avtar1"
                      width="40"
                      height="40"
                      sizes="100vw"
                    />
                  </div>
                  <div className="-m-2 transform hover:scale-125">
                    <Image
                      src="/av2.png" // change this later on
                      alt="avtar1"
                      width="40"
                      height="40"
                      sizes="100vw"
                    />
                  </div>
                  <div className="-m-2 transform hover:scale-125">
                    <Image
                      src="/av3.png" // change this later on
                      alt="avtar1"
                      width="40"
                      height="40"
                      sizes="100vw"
                    />
                  </div>
                  <div className="-m-2 transform hover:scale-125">
                    <Image
                      src="/av4.png" // change this later on
                      alt="avtar1"
                      width="40"
                      height="40"
                      sizes="100vw"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-medium">Join The Growing Community</p>
                </div>
              </div>
              <p className="font-extralight ">
                Zeta Swap enables secure exchanges of cryptocurrencies, NFTs,
                and tokens among independent parties, with transactions
                conducted directly between them and without requiring the
                involvement of a third party.{" "}
              </p>
            </div>
          </div>
        </div>
        <div  className="2xl:col-span-3 xl:col-span-3 md:col-span-1 sm:col-span-1 parent-div relative">
          <div className="min-h-fit custom-div justify-evenly">
            <div>
              <LandingCard1 />
            </div>
            <div className="image-container min-w-[1rem] mx-1">
              <Image
                src="/swap.png" // change this later on
                alt="right-arrow!"
                width="30"
                height="20"
                sizes="100vw"
              />
            </div>
            <div>
              <LandingCard2 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
