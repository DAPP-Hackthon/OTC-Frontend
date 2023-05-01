import React, { useState } from "react";
import LandingCard1 from "@/components/cards/landingCard1";
import LandingCard2 from "@/components/cards/landingCard2";
import Image from "next/image";
import Tilt from "react-parallax-tilt";

export default function Home() {
  const [scale, setScale] = useState(1.15);
  return (
    <div className="flex flex-col items-center h-screen text-white dark:text-white ">
      <div
        className={
          "grid xl:grid-cols-8 md:grid-cols-1 sm:grid-cols-1 grid-cols-1  gap-y-4 gap-x-8"
        }
      >
        <div className="2xl:col-span-5 xl:col-span-5  md:col-span-1 sm:col-span-1">
          <h1 className="text-2xl font-benzin xs:text-3xl  sm:text-4xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-4xl 3xl:text-8xl  font-bold custom-font">
            Seamless and Secure Cross Chain & Peer to Peer OTC Swaps
          </h1>
          {/* <h1 className="text-[400%] font-bold custom-font">
            Seamless and Secure Cross Chain & Peer to Peer OTC Swaps
          </h1> */}

          <div className="grid mt-10 min-h-fit grid-cols-2 2xl:grid-cols-2 xl:grid-cols-2 md:grid-cols-2 gap-y-2 gap-x-4">
            {/* <div className="block min-h-fit 2xl:block xl:block lg:block md:block"> */}
            <Tilt scale={scale} transitionSpeed={2500}>
              {/* <img src="/landing.png" className="w-" />          */}
              <div className="flex h-full justify-center">
              <Image
                src="/landing.png" // change this later on
                alt="cube"
                width="0"
                height="0"
                sizes="100vw"
                className="w-full h-auto aspect-square self-center"
              />
              </div>
            </Tilt>
            {/* </div> */}
            <div className="self-center ">
              <div className="grid gap-1 sm:gap-2 md:gap-3 3xl:gap-14 ">
                <div className="flex items-center min-w-fit ">
                  <div className="hover:scale-125">
                    <Tilt scale={scale} transitionSpeed={2500}>
                      <Image
                        src="/ava4.png" // change this later on
                        alt="avtar11"
                        width="0"
                        height="0"
                        sizes="100vw"
                        className="h-[2rem] w-auto sm:h-[3rem] md:h-[50px] lg:h-[4rem] 3xl:h-[7rem] aspect-square"
                      />
                    </Tilt>
                  </div>
                  <div className="-m-2 transform hover:scale-125">
                    <Tilt scale={scale} transitionSpeed={2500}>
                      <Image
                        src="/ava3.png" // change this later on
                        alt="avtar1"
                        width="50"
                        height="40"
                        sizes="100vw"
                        className="h-[2rem] w-auto sm:h-[3rem] md:h-[50px] lg:h-[4rem] 3xl:h-[7rem] aspect-square"
                      />
                    </Tilt>
                  </div>
                  <div className="-m-2 transform hover:scale-125">
                    <Tilt scale={scale} transitionSpeed={2500}>
                      <Image
                        src="/ava2.png" // change this later on
                        alt="avtar1"
                        width="50"
                        height="40"
                        sizes="100vw"
                        className="h-[2rem] w-auto sm:h-[3rem] md:h-[50px] lg:h-[4rem] 3xl:h-[7rem] aspect-square"
                      />
                    </Tilt>
                  </div>
                  <div className="-m-2 transform hover:scale-125">
                    <Tilt scale={scale} transitionSpeed={2500}>
                      <Image
                        src="/ava1.png" // change this later on
                        alt="avtar1"
                        width="50"
                        height="40"
                        sizes="100vw"
                        className="h-[2rem] w-auto sm:h-[3rem] md:h-[50px] lg:h-[4rem] 3xl:h-[7rem] aspect-square"
                      />
                    </Tilt>
                  </div>
                </div>

                <p className=" font-poppins text-xs xs:text-sm sm:text-xl md:text-xl 2xl:text-2xl 3xl:text-5xl font-medium leading-4 sm:leading-5 3xl:leading-10 ">Join The Growing Community</p>
                <p className=" font-poppins italic text-xs xs:text-sm sm:text-xl md:text-xl  2xl:text-2xl 3xl:text-5xl leading-4">Swap directly with any one</p>
                <p className="font-extralight  text-[9px] xs:text-sm sm:text-base md:text-lg  2xl:text-xl 3xl:text-4xl leading-3 sm:leading-4 3xl:leading-10">
                  Zeta Swap enables secure exchanges of cryptocurrencies, NFTs,
                  and tokens among independent parties, with transactions
                  conducted directly between them and without requiring the
                  involvement of a third party.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="2xl:col-span-3 xl:col-span-3 md:col-span-1 sm:col-span-1 parent-div relative">
          <div className="min-h-fit custom-div justify-evenly">
            <div>
              <LandingCard1 />
            </div>
            <div className="image-container min-w-[1rem] mx-1">
              <Image
                src="/swap.png" // change this later on
                alt="right-arrow!"
                width="0"
                height="0"
                sizes="100vw"
                className="w-[7%] md:w-[5%] xl:w-[7%]  h-auto aspect-square"
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
