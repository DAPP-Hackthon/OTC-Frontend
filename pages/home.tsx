import React, { useState } from "react";
import LandingCard1 from "@/components/cards/landingCard1";
import LandingCard2 from "@/components/cards/landingCard2";
import Image from "next/image";
import Tilt from "react-parallax-tilt";

export default function Home() {
  const [scale, setScale] = useState(1.15);
  return (
    <div className="flex flex-col items-center text-white dark:text-white ">
      <div
        className={
          "grid xl:grid-cols-8 md:grid-cols-1 sm:grid-cols-1 grid-cols-1  gap-y-4 gap-x-8"
        }
      >
        <div className="2xl:col-span-5 xl:col-span-5  md:col-span-1 sm:col-span-1">
          <h1 className="text-xl xs:text-2xl font-gilroy sm:text-3xl md:text-4xl lg:text-4xl xl:text-4xl 2xl:text-5xl 3xl:text-8xl 4xl:text-9xl leading-tight  font-bold ">
            Seamless and Secure Cross Chain & Peer to Peer{" "}
            <span className="text-[#01F5AB]">OTC Swaps</span>
          </h1>
      
          <div className="relative grid mt-10 min-h-fit grid-cols-1 lg:grid-cols-2 gap-y-2  3xl:py-[2rem] 4xl:py-[3rem]">
            
           
              <Tilt scale={scale} transitionSpeed={2500}>
                <div className="z-30  flex h-full justify-center">
                  <Image
                    src="/landing.png" // change this later on
                    alt="cube"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="relative w-[50%] xl:w-[80%] h-auto aspect-square self-center"
                  />
                </div>
              </Tilt>
        
            <div className="z-20 self-center ">
              <div className="grid gap-1 sm:gap-2 md:gap-3 3xl:gap-14 ">
                <div className=" flex gap-x-4 xl:grid xl:grid-cols-2 md:gap-x-4">
                  <div className="flex items-center min-w-fit mb-2 ">
                    <div className="hover:scale-125">
                      <Tilt scale={scale} transitionSpeed={2500}>
                        <Image
                          src="/ava4.png" // change this later on
                          alt="avtar11"
                          width="0"
                          height="0"
                          sizes="100vw"
                          className="h-[2rem] w-auto sm:h-[3rem] md:h-[50px] lg:h-[4rem] 3xl:h-[7rem] 4xl:h-[9rem] aspect-square"
                        />
                      </Tilt>
                    </div>
                    <div className="-m-2 xl:-m-4 3xl:-m-6 transform hover:scale-125">
                      <Tilt scale={scale} transitionSpeed={2500}>
                        <Image
                          src="/ava3.png" // change this later on
                          alt="avtar1"
                          width="50"
                          height="40"
                          sizes="100vw"
                          className="h-[2rem] w-auto sm:h-[3rem] md:h-[50px] lg:h-[4rem] 3xl:h-[7rem] 4xl:h-[9rem] aspect-square"
                        />
                      </Tilt>
                    </div>
                    <div className="-m-2 xl:-m-4 3xl:-m-6 transform hover:scale-125">
                      <Tilt scale={scale} transitionSpeed={2500}>
                        <Image
                          src="/ava2.png" // change this later on
                          alt="avtar1"
                          width="50"
                          height="40"
                          sizes="100vw"
                          className="h-[2rem] w-auto sm:h-[3rem] md:h-[50px] lg:h-[4rem] 3xl:h-[7rem] 4xl:h-[9rem] aspect-square"
                        />
                      </Tilt>
                    </div>
                    <div className="-m-2 xl:-m-4 3xl:-m-6 transform hover:scale-125">
                      <Tilt scale={scale} transitionSpeed={2500}>
                        <Image
                          src="/ava1.png" // change this later on
                          alt="avtar1"
                          width="50"
                          height="40"
                          sizes="100vw"
                          className="h-[2rem] w-auto sm:h-[3rem] md:h-[50px] lg:h-[4rem] 3xl:h-[7rem] 4xl:h-[9rem] aspect-square"
                        />
                      </Tilt>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="font-poppins text-xs xs:text-sm sm:text-xl md:text-lg xl:text-lg 2xl:text-[1rem] 3xl:text-4xl 4xl:text-5xl font-medium leading-4 sm:leading-6 lg-leading-tight 3xl:leading-normal 4xl:leading-normal ">
                      Join The Growing Community
                    </p>
                  </div>
                </div>
                <p className=" font-poppins text-sm xs:text-lg sm:text-2xl md:text-3xl  2xl:text-[1.5rem] 3xl:text-5xl 4xl:text-6xl leading-4 sm:leading-6 lg-leading-tight">
                  Swap directly with any one
                </p>
                <p className="font-extralight font-poppins text-[9px] xs:text-sm sm:text-base md:text-lg  2xl:text-[1rem] 3xl:text-4xl 4xl:text-5xl leading-3 sm:leading-4 3xl:leading-tight">
                  Zeta Swap enables secure exchanges of cryptocurrencies, NFTs,
                  and tokens among independent parties, with transactions
                  conducted directly between them and without requiring the
                  involvement of a third party.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relatve vector-background 2xl:col-span-3 xl:col-span-3 md:col-span-1 sm:col-span-1 relative">
          <div className="min-h-fit custom-div justify-evenly">
            <div className="w-[35%] xl:w-auto">
              <LandingCard1 />
            </div>
            <div className="image-container min-w-[1rem] mx-1 rotate-90 xl:rotate-0">
              <Image
                src="/swap.png" // change this later on
                alt="right-arrow!"
                width="0"
                height="0"
                sizes="100vw"
                className="w-4 md:w-8 xl:w-[7%]  h-auto aspect-square"
              />
            </div>
            <div className="w-[35%] xl:w-auto">
              <LandingCard2 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
