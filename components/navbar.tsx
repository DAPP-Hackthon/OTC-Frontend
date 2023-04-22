import React, { useState } from "react";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState(0); // Keep track of active link
  const { disconnectAsync } = useDisconnect();
  const { open } = useWeb3Modal();
  const items = [
    { label: "Home", href: "/home" },
    { label: "Trade", href: "/trade" },
    { label: "My Trade", href: "/myTrade" },
    { label: "All Trade", href: "/allTrade" },
  ];
  const { isConnected, address } = useAccount({
    onConnect({ address }) {
      if (!address) return;
      // handleTokens(address);
    },
  });
  return (
    <nav className="sticky z-auto left-0 top-0 flex w-full justify-between border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:w-full   lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
      {/* <div className="flex items-center">
        <Link href="/">
          <p className="text-white ml-4 font-bold text-lg">OTC</p>
        </Link>
        <Link href="/trade">
          <p className="text-white ml-4 hover:text-gray-300">Trade</p>
        </Link>
        <Link href="/my-trade">
          <p className="text-white ml-4 hover:text-gray-300">My Trade</p>
        </Link>
        <Link href="/all-trade">
          <p className="text-white ml-4 hover:text-gray-300">All Trade</p>
        </Link>
      </div> */}
      <ul className="ml-10 flex items-baseline space-x-4">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            onClick={() => setActiveLink(index)}
            className={`relative px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 rounded-lg`}
          >
            <p
              className={`relative px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 
            ${activeLink === index ? "border-b-2 border-white" : ""}
            `}
            >
              {item.label}
            </p>
            {/* <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-transform duration-200 transform scale-x-0"></span> */}
          </Link>
        ))}
      </ul>
      {/* <div className="container flex items-center justify-center p-6 mx-auto text-gray-600 capitalize dark:text-gray-300">
        <a
          href="home"
          className="text-gray-800 dark:text-gray-200 border-b-2 border-blue-500 mx-1.5 sm:mx-6"
        >
          home
        </a>

        <a
          href="allTrade"
          className="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
        >
          All Trade
        </a>

        <a
          href="#"
          className="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
        >
          pricing
        </a>

        <a
          href="#"
          className="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6"
        >
          blog
        </a>
       
      </div> */}

      <div className="flex items-center">
        {isConnected && (
          <button className="mr-4" onClick={() => disconnectAsync()}>
            Disconnect Wallet
          </button>
        )}
        <button onClick={() => open()}>
          {isConnected ? (
            <p className="text-white hover:text-gray-300 mr-4 max-w-[4rem] truncate">
              {address}
            </p>
          ) : (
            <p className="text-white hover:text-gray-300 mr-4">
              Connect Wallet
            </p>
          )}
        </button>

        <p className="text-white hover:text-gray-300 mx-4">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 12c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0 2c-3.86 0-7 3.14-7 7v1h14v-1c0-3.86-3.14-7-7-7zm0 2c2.21 0 4 1.79 4 4 0 2.21-1.79 4-4 4-2.21 0-4-1.79-4-4 0-2.21 1.79-4 4-4z" />
          </svg>
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
