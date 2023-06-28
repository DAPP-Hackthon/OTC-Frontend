import React, { useState } from "react";
import LandingCard1 from "@/components/cards/landingCard1";
import LandingCard2 from "@/components/cards/landingCard2";
import Image from "next/image";
import Tilt from "react-parallax-tilt";
import LandingCard3 from "@/components/cards/landingCard3";
import LandingCard4 from "@/components/cards/landingCard4";
export default function Home() {
  const [scale, setScale] = useState(1.15);
  return (
    <div className="flex flex-col items-center text-white dark:text-white ">
      {/* Part1 */}

      <h1 className="text-xl xs:text-2xl font-gilroyB sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-7xl 3xl:text-8xl 4xl:text-9xl leading-tight  font-bold ">
        Seamless and Secure Cross Chain & Peer to Peer{" "}
        <span className="text-[#01F5AB]">OTC Swaps</span>
      </h1>
      <div className="relative flex justify-center m-[5%] gap-[10%]">
        <div className="w-[35%]">
          <Image
            src="/card1.png" // change this later on
            alt="Card-1"
            width="0"
            height="0"
            sizes="100vw"
            className="w-full h-[90%]"
          />
        </div>
        <div className="absolute top-[35%] w-[3%]">
          <Image
            src="/swap.png" // change this later on
            alt="swap"
            width="0"
            height="0"
            sizes="100vw"
            className="w-full"
          />
        </div>
        <div className="w-[35%]">
          <Image
            src="/card2.png" // change this later on
            alt="Card-2"
            width="0"
            height="0"
            sizes="100vw"
            className="w-full"
          />
        </div>
      </div>

      {/* part 2 */}
      <div className=" flex justify-center gap-x-[4%]">
        <div className="transform transition-transform duration-300 hover:scale-105">
          <Image
            src="/Steps-1.png" // change this later on
            alt="cube"
            width="0"
            height="0"
            sizes="100vw"
            className="w-full"
          />
        </div>

        <div className="transform transition-transform duration-300 hover:scale-105">
          <Image
            src="/Steps-2.png" // change this later on
            alt="cube"
            width="0"
            height="0"
            sizes="100vw"
            className="w-full"
          />
        </div>

        <div className="transform transition-transform duration-300 hover:scale-105">
          <Image
            src="/Steps-3.png" // change this later on
            alt="cube"
            width="0"
            height="0"
            sizes="100vw"
            className="w-full"
          />
        </div>
      </div>
      {/* <div className="mt-[5%] font-gilroy flex gap-x-[2rem] justify-around">
        <LandingCard3 
        heading="Safeguard Your Swaps"
        imageSrc="/step1.png"
        description="  Discovered a swapping partner ? Zetaswap simplifies the process
        while providing security against fraudulent activities."
        />
        <LandingCard3 
        heading="No extra costs. Zero slippage"
        imageSrc="/step2.png"
        description=" Eliminate slippage & excessive swap fees. Zetaswap applies a nominal fixed fee for each swap. Take advantage of fee-free swapping during our promotional periods!"
        />
        <LandingCard3 
        heading="Revolutionize NFT Trading"
        imageSrc="/step3.png"
        description="Zetaswap makes swapping NFTs as easy as exchanging coins. Explore popular collections or customize your own for seamless transactions."
        />
      </div> */}

      {/* Part 3 */}

      <div className="relative grid mt-[5%] min-h-fit grid-cols-2 gap-y-2  3xl:py-[2rem] 4xl:py-[3rem]">
        <div className="z-20 p-[5%] self-center ">
          <div className="grid gap-2 sm:gap-2 md:gap-3 3xl:gap-5 ">
            <div className=" flex gap-x-4 md:gap-x-4 xl:gap-x-6 2xl:gap-x-8 3xl:gap-x-12">
              <div className="flex my-auto items-center min-w-fit ">
                <div className="hover:scale-125">
                  <Tilt scale={scale} transitionSpeed={2500}>
                    <Image
                      src="/ava4.png" // change this later on
                      alt="avtar11"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-[1.5rem] w-auto sm:h-[2rem] md:h-[50px] lg:h-[4rem] 3xl:h-[7rem] 4xl:h-[9rem] aspect-square"
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
                      className="h-[1.5rem] w-auto sm:h-[2rem] md:h-[50px] lg:h-[4rem] 3xl:h-[7rem] 4xl:h-[9rem] aspect-square"
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
                      className="h-[1.5rem] w-auto sm:h-[2rem] md:h-[50px] lg:h-[4rem] 3xl:h-[7rem] 4xl:h-[9rem] aspect-square"
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
                      className="h-[1.5rem] w-auto sm:h-[2rem] md:h-[50px] lg:h-[4rem] 3xl:h-[7rem] 4xl:h-[9rem] aspect-square"
                    />
                  </Tilt>
                </div>
              </div>
              <div className="flex items-center">
                <p className="font-poppins text-[0.5rem] xs:text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-2xl 3xl:text-4xl 4xl:text-7xl font-medium leading-4 sm:leading-6 lg-leading-tight 3xl:leading-normal 4xl:leading-normal ">
                  Join The Growing Community
                </p>
              </div>
            </div>
            <p className=" font-poppins font-semibold text-sm xs:text-lg sm:text-2xl md:text-2xl  2xl:text-3xl 3xl:text-4xl 4xl:text-8xl leading-4 sm:leading-6 lg-leading-tight 2xl:leading-snug">
              Swap directly with anyone
            </p>
            <p className="font-gilroy tracking-wider font-semibold text-[#b2c7c6] text-[9px] xs:text-sm sm:text-base md:text-lg  2xl:text-[1.3rem] 3xl:text-3xl 4xl:text-6xl leading-3 sm:leading-4 3xl:leading-tight">
              Zeta Swap enables secure exchanges of cryptocurrencies, NFTs, and
              tokens among independent parties, with transactions conducted
              directly between them and without requiring the involvement of a
              third party.{" "}
            </p>
          </div>
        </div>
        <Tilt scale={scale} transitionSpeed={2500}>
          <div className="z-30  flex h-full justify-center">
            <Image
              src="/landing.png" // change this later on
              alt="cube"
              width="0"
              height="0"
              sizes="100vw"
              className="relative h-[10rem] xs:h-[12rem] sm:h-[15rem] md:h-[17rem] lg:h-[18rem] 2xl:h-[20rem] 3xl:h-[30rem] 4xl:h-[50rem] w-auto self-center"
            />
          </div>
        </Tilt>
      </div>

      {/* <div className="relative justify-center my-auto vector-background 2xl:col-span-3 xl:col-span-3 md:col-span-1 sm:col-span-1">
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
        </div> */}
      {/* part4 */}
      <div className="w-full mt-[4rem]">
        <h1 className="text-center font-gilroy font-extrabold sm:text-xl lg:text-2xl 2xl:text-[2.8rem] 3xl:text-[5rem]">
          A Sequential Walkthrough
        </h1>
        <LandingCard4
        index="1"
        heading="Connect Wallet"
        description=" This step allows users to securely connect their cryptocurrency
        wallet to the swapping platform, enabling them to access and
        manage their funds for the swapping process."
        />
        <LandingCard4
        index="2"
        heading="Create Swap"
        description=" Launch the application. Indicate the item you wish to swap and
        with whom, and create the swap. You can allow anybody to accept
        the swap, or make it exclusive for your peer by entering their
        address."
        />
        <LandingCard4
        index="3"
        heading=" Token Swap Execution"
        description="Upon verification and acceptance of the swap terms, the smart
        contract will proceed with executing the token swap."
        />
       
        {/* <div className="flex my-[5%] backdrop-blur-md rounded-[1.3rem] bg-white/5 py-[3%] px-[10%] gap-[7%]">
          <div className="font-gilroy font-bold blur-[8px]  whitespace-nowrap">
            <span className="text-[8rem] text-[#01f5ab]">2</span>
          </div>
          <div className="self-center font-gilroy ">
            <span className="text-[2.5rem] font-bold">Create Swap</span>
            <div className="spantext-base-1">
              <span className="text-[1.4rem] align-text-middle">
                Launch the application. Indicate the item you wish to swap and
                with whom, and create the swap. You can allow anybody to accept
                the swap, or make it exclusive for your peer by entering their
                address.
              </span>
            </div>
          </div>
        </div>
        <div className="flex my-[5%] backdrop-blur-md rounded-[1.3rem] bg-white/5 py-[3%] px-[10%] gap-[7%]">
          <div className="font-gilroy font-bold blur-[8px]  whitespace-nowrap">
            <span className="text-[8rem] text-[#01f5ab]">3</span>
          </div>
          <div className="self-center font-gilroy ">
            <span className="text-[2.5rem] font-bold">
              Token Swap Execution
            </span>
            <div className="spantext-base-1">
              <span className="text-[1.4rem] align-text-middle">
                Upon verification and acceptance of the swap terms, the smart
                contract will proceed with executing the token swap.
              </span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
