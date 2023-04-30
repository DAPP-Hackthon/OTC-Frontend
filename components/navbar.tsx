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
    { label: "Trade", href: "/trade" },
    { label: "My Trade", href: "/myTrade" },
    { label: "All Trade", href: "/allTrade" },
  ];
  const Navitems = [
    { label: "Trade", href: "/trade" },
    { label: "My Trade", href: "/myTrade" },
    { label: "All Trade", href: "/allTrade" },
    { label: "Profile", href: "/profile" },
  ];
  const network = [
    { label: "Ethereum Mainet", src: "/eth.png" },
    { label: "Zetachain Mainet", src: "/zetalogo.png" },
    { label: "Polygon Mainet", src: "/polygon.png" },
    { label: "Fantom Mainet", src: "/frame.png" },
    { label: "Cronos Mainet", src: "/cronos.png" },
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
    <nav className="z-50 2xl:px-[6rem] xl:px-[6rem] lg:px-[6rem] md:px-[6rem] sm:px-[6rem] px-[2rem] sticky left-0 top-0 flex w-full pb-2 pt-2 backdrop-blur-2xl lg:w-full lg:py-2 ">
      <div className="self-center mr-[3rem] min-w-fit ">
        <Link href={"/home"}>
          <Image
            src="/zetaswaplogo.png" // change this later on
            alt="zetaswap!"
            width="100"
            height="120"
            sizes="100vw"
          />
        </Link>
      </div>
      <div className=" w-full justify-between hidden lg:flex gap-10">
        <ul className="flex items-baseline space-x-4">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setActiveLink(index)}
              className={`relative px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 rounded-lg`}
            >
              <p
                className={`relative px-3 py-2 text-sm font-medium whitespace-nowrap text-white hover:bg-gray-700
            ${activeLink === index ? "border-b-2 border-white" : ""}
            `}
              >
                {item.label}
              </p>
            </Link>
          ))}
        </ul>

        <div className="flex items-center">
          <button
            onClick={openModal}
            className={`group min-w-fit text-sm rounded-xl backdrop-blur-2xl  mr-4 px-4 py-3 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/60 focus:outline-none ${selectedNetwork.src?"bg-white/10":"bg-white/10"}`}
          >
            <div className="flex">
              {selectedNetwork.src && (
                <div className="mr-2 self-center min-w-fit">
                  <Image
                    src={selectedNetwork.src} // change this later on
                    alt=""
                    width="20"
                    height="20"
                    sizes="100vw"
                  />
                </div>
              )}

              <p className="font-medium">{selectedNetwork.label}</p>
            </div>
          </button>
          <button
            className="group w-fit text-sm rounded-xl font-medium bg-[#00FFB2] px-4 py-3 text-[#13231D] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-green-200 focus:outline-none"
            onClick={() => open()}
          >
            {isConnected ? (
              <p className="text-center  w-[8rem] text-ellipsis overflow-hidden ...">{address}</p>
            ) : (
              <p className="text-center ">Connect Wallet</p>
            )}
          </button>

          <p className="text-white min-w-fit hover:text-gray-300 mx-4">
            <Image
              src="/profile.png" // change this later on
              alt="profile"
              width="40"
              height="20"
              sizes="100vw"
            />
          </p>
        </div>
      </div>
      {/* hidden Tab start */}
      {/* Hamberger Menu  */}
      <div className="flex h-10 ml-auto lg:hidden xl:hidden justify-evenly">
        <button
          onClick={openModal}
          className="group min-w-fit rounded-lg backdrop-blur-2xl bg-white/10 mr-4 px-2  text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-white/60 focus:outline-none "
              style={{minWidth: 'fit-content' }}
        >
          <div className="flex">
            {selectedNetwork.src && (
              <div className="mr-2 self-center min-w-fit">
                <Image
                  src={selectedNetwork.src} // change this later on
                  alt="ethereum"
                  width="20"
                  height="20"
                  sizes="100vw"
                />
              </div>
            )}

            <p className="text-xs whitespace-nowrap">{selectedNetwork.label}</p>
          </div>
        </button>
        <div className="relative self-center h-fit">
          <div className=" lg:hidden self-center transition-all mr-3 my-3 cursor-pointer hover:text-gray-700">
            {isMobileNavOpen ? (
              <AiOutlineMenuFold
                onClick={() => setisMobileNavOpen(false)}
                className="rounded text-2xl self-center h-fit"
              />
            ) : (
              <AiOutlineMenuUnfold
                onClick={() => setisMobileNavOpen(true)}
                className="rounded text-2xl self-center h-fit"
              />
            )}
          </div>
          <div className="absolute lg:hidden xl:hidden right-0 m-2 ">
            {isMobileNavOpen && (
              <div className="bg-[#004A3D] w-[297px] justify-center rounded-lg text-sm p-8">
                <ul className="leading-10">
                  {Navitems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setActiveLink(index)}
                    >
                      <li
                        className={`border-b py-3 text-xs border-gray-600 text-sm text-white`}
                      >
                        {item.label}
                      </li>
                    </Link>
                  ))}
                  <div className="text-center">
                    <button
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
        <div className="px-4 pb-8">
          <ul>
            {network?.map((item, index) => (
              <li
                onClick={() => handleNetwork(item.src, item.label)}
                key={index}
              >
                <div className="text-sm mt-2 z-50 w-full h-[3rem] flex items-center rounded-xl  bg-white/5 hover:bg-white/10 px-4 py-2 text-white cursor-pointer">
                  <div className="mr-2">
                    <Image
                      src={item.src} // change this later on
                      alt="ethereum"
                      width="20"
                      height="20"
                      sizes="100vw"
                    />
                  </div>
                  <p>{item.label}</p>
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
