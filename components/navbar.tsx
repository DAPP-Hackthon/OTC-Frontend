import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useWeb3Modal } from "@web3modal/react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
// import { navLinks } from "./data";
import { useRouter } from "next/router";
import Image from "next/image";
// import { Button } from "./buttons/button";
// import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai";
import CustomModal from "./modal/modal";
import Zeta from "../public/Zetaswaplogo.svg";
import { RxDotFilled } from "react-icons/rx";
import axios from "axios";
import { InjectedConnector } from "wagmi/connectors/injected";
import { sign } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import Cookies from "universal-cookie";
import { getAccount,signMessage } from "@wagmi/core";

export default function Navbar() {
  const { chain } = useNetwork();
  const [loginCred, setLoginCred] = useState();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const [isMobileNavOpen, setisMobileNavOpen] = useState(false); // For toggling the mobile nav
  console.log("chains", chains);
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const router = useRouter();
  const [selectedNetwork, setSelectedNetwork] = useState({
    label: "Select a Network",
    src: "",
  });
  const { isConnected, address } = useAccount({
    onConnect({ address }) {
      if (!address) return;
      // handleTokens(address);
    },
  });

  const [nextNetwork, setNextNetwork] = useState({
    label: "Select a Network",
    src: "",
    id: 0,
  });
  const [activeLink, setActiveLink] = useState<number | null>(null);
  //   If button is there
  const handleClick = () => {
    if (isMobileNavOpen) {
      setisMobileNavOpen(false);
    }
  };

  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();

  const handleNetwork = () => {
    if (chain?.id === nextNetwork.id) {
      setSelectedNetwork({
        label: nextNetwork.label,
        src: nextNetwork.src,
      });
    }
  };

  useEffect(() => {
    if (!isConnected) {
      setSelectedNetwork({
        label: "Select a Network",
        src: "",
      });
    } else {
      const selectedNetwork = network.find((item) => item.id === chain?.id);
      // const { label, src } = selectedNetwork;
      // console.log("selectedNetwork:", selectedNetwork?.label);
      // console.log("Src:", src);
      if (selectedNetwork != null) {
        setSelectedNetwork({
          label: selectedNetwork?.label,
          src: selectedNetwork?.src,
        });
      } else {
        setSelectedNetwork({
          label: "Unsupported Network",
          src: "",
        });
      }
    }
    if (!isLoading) {
      handleNetwork();
    }
  }, [isLoading, isConnected]);

  // console.log(chains, isLoading);
  const items = [
    { label: "Swap", href: "/swap" },
    { label: "My Trade", href: "/myTrade" },
    { label: "All Trade", href: "/allTrade" },
  ];
  const Navitems = [
    { label: "Swap", href: "/Swap" },
    { label: "My Trade", href: "/myTrade" },
    { label: "All Trade", href: "/allTrade" },
  ];
  const network = [
    { label: "Zetachain Athens 2", src: "/zetalogonew.png", id: 7001 },
    { label: "ETH Goerli", src: "/eth.png", id: 5 },
    { label: "Polygon Mumbai", src: "/polygon.png", id: 80001 },
    { label: "BSC Testnet", src: "/binancedex.png", id: 97 },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  // const { data, isError, isSuccess, signMessage } = useSignMessage({
  //   message: `Signing with acc: ${address}`, 
  // });
  const signAccount = async () =>{
    const signature = signMessage(
      {
          message: `Signing with acc: ${address}`, 
        }
    )
    return signature
  }
  const handleLogin = async () => {
    const signature = await signAccount()
    console.log("data",signature)
    try {
      
      const response1 = await axios.post(
        "http://localhost:8000/auth/login",
        {
          walletAddress: address,
          signature: signature,
        }
      );
      const cookies = new Cookies();
      // console.log("response1", response1);
      cookies.set("access_token", response1.data.accessToken, { path: "/" });
      cookies.set("refresh_token", response1.data.refreshToken, { path: "/" });
      // localStorage.setItem('access_token', response1.data.accessToken);
      // localStorage.setItem('refresh_token', response1.data.refreshToken);
      // localStorage.setItem('login_id', response1.data._id);
      setLoginCred(response1.data);
    } catch (error) {
      // console.log(error);
    }
  };
  const [connectText, setConnectText] = useState<string | null>(null);
  useEffect(() => {
    if (isConnected) {
      setConnectText(`${address}`);
      handleLogin();
    } else {
      setConnectText("Connect Wallet");
    }
  }, [isConnected]);
  // useEffect(() => {
  //   disconnect();
  // }, [isError]);
  console.log("loginCred", loginCred);

  return (
    <nav className="z-50  space-x-[5%] pt-4 lg:py-[2rem] xl:py-[2rem] 3xl:py-[3rem]   font-poppins items-center min-h-[8vh] lg:h-[10vh] xl:h-[12vh] 3xl:h-[14vh] 3xl:px-[12rem] md:px-[6rem] sm:px-[6rem] px-[2rem] sticky left-0 top-0 flex w-full backdrop-blur-2xl lg:w-full  ">
      {/* <div className=""> */}

      <div
        className="flex items-center cursor-pointer"
        onClick={() => {
          setActiveLink(null);
          router.push("/");
        }}
      >
        {/* <button onClick={() => signMessage()}>Sign</button>
        <button onClick={() => handleApi()}>Test</button> */}
        <Image
          src="/zetaswaplogo3.png"
          alt="zetaswap!"
          width="0"
          height="0"
          sizes="100vw"
          className="h-full min-w-[8rem] xl:min-w-[10rem] 2xl:min-w-[10rem] 3xl:min-w-[18rem] 4xl:min-w-[22rem] mr-3  "
        />
        <div className="hidden">
          <Zeta />
        </div>
      </div>
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
                className={`relative px-3 py-2 4xl:py-4 text-sm   2xl:text-[1rem] 3xl:text-3xl 4xl:text-5xl font-medium whitespace-nowrap c
            ${
              activeLink === index
                ? "border-b-2 4xl:border-b-8 border-[#00FFB2] text-[#00FFB2]"
                : "text-white"
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
              selectedNetwork.src ? "bg-[#232425]" : "bg-white/10"
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

              <p className="text-[0.9rem] 3xl:text-3xl  4xl:text-5xl whitespace-nowrap">
                {selectedNetwork.label}
              </p>
            </div>
          </button>

          <button
            className="group text-[0.9rem] w-fit 4xl:h-36 rounded-xl font-medium bg-[#00FFB2]  px-4 3xl:px-8 py-3 3xl:py-8 3xl:rounded-3xl text-[#13231D] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-green-200 focus:outline-none"
            // onClick={() => {
            //   isConnected ? disconnect() : connect();
            //   //  isConnected?disconnect(): connect()
            // }}
            // onClick={() => {
            //   isConnected ? disconnect() : connect();
            // }}
            onClick={() => open()}
          >
            {isConnected ? (
              <p className="text-center  text-[0.9rem] w-[8rem] text-ellipsis overflow-hidden ...">
                {address}
              </p>
            ) : (
              <p className="text-center  whitespace-nowrap 3xl:text-3xl 4xl:text-5xl ">
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
                      onClick={() => {
                        isConnected ? disconnect() : connect();
                      }}
                    >
                      {/* {isConnected ? (
                        <p className="text-center font-medium text-ellipsis overflow-hidden ...">
                          {address}
                        </p>
                      ) : (
                        <p className="text-center ">Connect Wallet</p>
                      )} */}
                      <p className="text-center font-medium text-ellipsis overflow-hidden ...">
                        {connectText}
                      </p>
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
            {/* {network?.map((item, index) => (
              <li
                onClick={() => {
                  handleNetwork(item.src, item.label);
                }}
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
            ))} */}
            {!isConnected && (
              <div>
                <p>Connect Your wallet</p>
              </div>
            )}
            {network?.map((item, index) => {
              const chainNetwork = chains.find((c) => c.id === item.id);

              if (!chainNetwork) {
                return null; // Handle case when corresponding chain is not found
              }
              return (
                <li
                  onClick={() => {
                    switchNetwork?.(item.id);
                    // handleNetwork(item.src, item.label, item.id);
                    setNextNetwork({
                      label: `${item.label}`,
                      src: `${item.src}`,
                      id: item.id,
                    });
                  }}
                  key={index}
                >
                  <div className="text-sm mt-4 z-50 w-full h-[3rem] 3xl:h-[5rem] 4xl:h-[8rem] flex items-center justify-between rounded-xl 4xl:rounded-[2rem]  bg-white/5 hover:bg-white/10 px-4 py-2 3xl:py-8 text-white cursor-pointer">
                    <div className="flex items-center">
                      <div className="mr-2">
                        <Image
                          src={item.src} // change this later on
                          alt="chainNetwork"
                          width="0"
                          height="0"
                          sizes="100vw"
                          className="3xl:w-[2rem] 4xl:w-[3rem] w-[2rem] h-full"
                        />
                      </div>

                      <p className="3xl:text-3xl 4xl:text-4xl">{item.label}</p>
                    </div>
                    {chain?.id === item.id ? (
                      <p className="flex items-center 3xl:text-3xl 4xl:text-4xl">
                        Connected{" "}
                        <RxDotFilled className="text-xl text-[#30E000]" />
                      </p>
                    ) : (
                      isLoading &&
                      pendingChainId === item.id && (
                        <p className="flex items-center 3xl:text-3xl 4xl:text-4xl">
                          Confirm in wallet{" "}
                          <RxDotFilled className="text-xl text-[#FFD641]" />
                        </p>
                      )
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </CustomModal>
      {/* hidden Tab end */}
    </nav>
  );
}
