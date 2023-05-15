import React, { useState } from "react";
import Link from "next/link";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { navLinks } from "./data";
import { useRouter } from "next/router";
import Image from "next/image";
import { Button } from "./buttons/button";
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai";
import CustomModal from "./modal/modal";
import Zeta from "../public/Zetaswaplogo.svg";

export default function Navbar() {
  const [isMobileNavOpen, setisMobileNavOpen] = useState(false); // For toggling the mobile nav
  const router = useRouter();
  const [selectedNetwork, setSelectedNetwork] = useState({
    label: "Select a Network",
    src: "",
  });
  const [activeLink, setActiveLink] = useState(0);
  //   If button is there
  const handleClick = () => {
    if (isMobileNavOpen) {
      setisMobileNavOpen(false);
    }
  };
  const { disconnectAsync } = useDisconnect();
  const { open } = useWeb3Modal();
  function handleNetwork(href: string, label: string) {
    console.log(href, label);
    setSelectedNetwork({
      label: `${label}`,
      src: `${href}`,
    });
  }
  const items = [
    { label: "Swap", href: "/swap" },
    { label: "My Trade", href: "/myTrade" },
    { label: "All Trade", href: "/allTrade" },
  ];
  const Navitems = [
    { label: "Swap", href: "/Swap" },
    { label: "My Trade", href: "/myTrade" },
    { label: "All Trade", href: "/allTrade" },
    { label: "Profile", href: "/profile" },
  ];
  const network = [
    { label: "Zetachain", src: "/zetalogonew.png" },
    { label: "Ethereum", src: "/eth.png" },
    { label: "BSC", src: "/binancedex.png" },
    { label: "Arbitrum", src: "/arbitrum.png" },
    { label: "Optimism", src: "/optimism.png" },
  ];
  const { isConnected, address } = useAccount({
    onConnect({ address }) {
      if (!address) return;
      // handleTokens(address);
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <nav className="z-50  space-x-[5%] pt-4 lg:pt-[2rem] xl:pt-[2rem] 3xl:pt-[3rem]   font-poppins items-center min-h-[8vh] lg:h-[10vh] xl:h-[12vh] 3xl:h-[14vh] 3xl:px-[12rem] md:px-[6rem] sm:px-[6rem] px-[2rem] sticky left-0 top-0 flex w-full pb-2 backdrop-blur-2xl lg:w-full lg:py-2  ">
      {/* <div className=""> */}

      <Link className="flex items-center" href={"/home"}>
        <Image
          src="/Zetaswaplogo.svg"
          alt="zetaswap!"
          width="0"
          height="0"
          sizes="100vw"
          className="h-full min-w-[8rem] xl:min-w-[10rem] 2xl:min-w-[10rem] 3xl:min-w-[18rem] 4xl:min-w-[22rem] mr-3  "
        />
        <div className="hidden">
          <Zeta />
        </div>
      </Link>
      {/* <Zeta /> */}
      {/* </div> */}
      <div className=" h-full flex-grow justify-between hidden lg:flex gap-10">
        <ul className="flex items-center justify-center space-x-4 4xl:space-x-12">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setActiveLink(index)}
              className={`relative px-3 py-2 text-sm font-medium text-white  rounded-lg`}
            >
              <p
                className={`relative px-3 py-2 4xl:py-4 text-sm   2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl font-medium whitespace-nowrap text-white 
            ${
              activeLink === index
                ? "border-b-2 4xl:border-b-8 border-white"
                : ""
            }
            `}
              >
                {item.label}
              </p>
            </Link>
          ))}
        </ul>

        <div className="flex  items-center 4xl:gap-x-8">
          <button
            onClick={openModal}
            className={`group min-w-fit 4xl:h-36 text-sm rounded-xl 3xl:rounded-3xl backdrop-blur-2xl  mr-4 px-4 3xl:px-8  lg:py-3 3xl:py-8 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/60 focus:outline-none ${
              selectedNetwork.src ? "bg-white/10" : "bg-white/10"
            }`}
          >
            <div className="flex">
              {selectedNetwork.src && (
                <div className="mr-2 self-center min-w-fit">
                  <Image
                    src={selectedNetwork.src}
                    alt="Crypto"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="mr-2 w-2 lg:w-3 2xl:w-4 3xl:w-8"
                  />
                </div>
              )}

              <p className="font-medium 2xl:text-[1rem] 3xl:text-3xl  4xl:text-5xl whitespace-nowrap">
                {selectedNetwork.label}
              </p>
            </div>
          </button>
          <button
            className="group w-fit 4xl:h-36 text-sm rounded-xl font-medium bg-[#00FFB2]  px-4 3xl:px-8 py-3 3xl:py-8 3xl:rounded-3xl text-[#13231D] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-green-200 focus:outline-none"
            onClick={() => open()}
          >
            {isConnected ? (
              <p className="text-center  w-[8rem] text-ellipsis overflow-hidden ...">
                {address}
              </p>
            ) : (
              <p className="text-center  whitespace-nowrap 2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl ">
                Connect Wallet
              </p>
            )}
          </button>

          {/* <p className="text-white min-w-fit hover:text-gray-300 mx-4">
            <Image
              src="/profile.png" // change this later on
              alt="profile"
              width="40"
              height="20"
              sizes="100vw"
            />
          </p> */}
        </div>
      </div>

      {/* hidden Tab start */}
      {/* Hamberger Menu  */}

      <div className="flex justify-end h-10 flex-grow  lg:hidden xl:hidden ">
        <button
          onClick={openModal}
          className="group min-w-fit rounded-lg backdrop-blur-2xl bg-white/10 mr-4 px-2  text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/60 focus:outline-none "
          style={{ minWidth: "fit-content" }}
        >
          <div className="flex">
            {selectedNetwork.src && (
              <div className=" self-center w-fit ">
                <Image
                  src={selectedNetwork.src} // change this later on
                  alt="ethereum"
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="w-4 mr-3"
                />
              </div>
            )}

            <p className="text-xs md:text-base whitespace-nowrap ">
              {selectedNetwork.label}
            </p>
          </div>
        </button>
        <div className="relative self-center h-fit">
          {/* <div className=" lg:hidden  self-center transition-all  cursor-pointer hover:text-gray-700">
            {isMobileNavOpen ? (
              <AiOutlineMenuFold
                onClick={() => setisMobileNavOpen(false)}
                className="rounded text-xl md:text-3xl self-center h-fit"
              />
            ) : (
              <AiOutlineMenuUnfold
                onClick={() => setisMobileNavOpen(true)}
                className="rounded text-xl md:text-3xl self-center h-fit"
              />
            )}
          </div> */}
          <div className="flex items-center ">
            <button
              className="mobile-menu-button"
              onClick={() => setisMobileNavOpen(!isMobileNavOpen)}
            >
              {isMobileNavOpen ? (
                <div className="opacity-80 transition-all hover:opacity-1">
                  <div className="w-4 h-0.5 rounded bg-[#C7E6F8] transition-all rotate-45"></div>
                  <div className="w-4 h-0.5 rounded bg-[#C7E6F8] transition-all cross_other"></div>
                </div>
              ) : (
                <div className="opacity-80 transition-all hover:opacity-1">
                  <div className="w-4 h-0.5 mb-1 rounded bg-[#C7E6F8]"></div>
                  <div className="w-4 h-0.5 mb-1 rounded bg-[#C7E6F8]"></div>
                  <div className="w-4 h-0.5 rounded bg-[#C7E6F8]"></div>
                </div>
              )}
            </button>
          </div>
          <div className="absolute lg:hidden xl:hidden right-0 m-2 ">
            {isMobileNavOpen && (
              <div className="bg-[#004A3D] w-[297px] justify-center rounded-lg text-sm p-8">
                <ul className="leading-10">
                  {Navitems.map((item, index) => (
                    // <Link
                    //   key={index}
                    //   href={item.href}
                    //   onClick={() => setActiveLink(index)}
                    // >
                    <li
                      key={index}
                      className={`border-b py-3 text-xs border-gray-600 text-sm text-white`}
                    >
                      {item.label}
                    </li>
                    // </Link>
                  ))}
                  <div className="text-center">
                    <button
                      disabled
                      className="group mx-auto mt-4 w-[12rem] rounded-lg bg-[#00FFB2] px-4 text-black transition-all duration-300 ease-in-out hover:scale-105 hover:bg-green-200 focus:outline-none"
                      onClick={() => open()}
                    >
                      {isConnected ? (
                        <p className="text-center font-medium text-ellipsis overflow-hidden ...">
                          {address}
                        </p>
                      ) : (
                        <p className="text-center ">Connect Wallet</p>
                      )}
                    </button>
                  </div>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <CustomModal
        title="Switch Network"
        handleExit={closeModal}
        isOpen={isModalOpen}
        onRequestClose={closeModal}
      >
        <div className="px-4 pb-8  ">
          <ul className="">
            {network?.map((item, index) => (
              <li
                onClick={() => handleNetwork(item.src, item.label)}
                key={index}
              >
                <div className="text-sm mt-4 z-50 w-full h-[3rem] 3xl:h-[5rem] 4xl:h-[8rem] flex items-center rounded-xl 4xl:rounded-[2rem]  bg-white/5 hover:bg-white/10 px-4 py-2 3xl:py-8 text-white cursor-pointer">
                  <div className="mr-2">
                    <Image
                      src={item.src} // change this later on
                      alt="ethereum"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="3xl:w-[2rem] 4xl:w-[3rem] w-[2rem] h-full"
                    />
                  </div>
                  <p className="3xl:text-3xl 4xl:text-4xl">{item.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CustomModal>
      {/* hidden Tab end */}
    </nav>
  );
}
