import React, { useState } from "react";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState(0); // Keep track of active link
  const[ collapse, setCollapse]= useState(false);
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
          </Link>
        ))}
      </ul>

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
    // <nav
    //   className="
    //       sticky
    //       left-0 top-0
    //       flex flex-wrap
    //       items-center
    //       justify-between
    //       w-full
    //       py-4
    //       md:py-0
    //       2xl:px-[6rem] xl:px-[6rem] lg:px-[6rem] md:px-[6rem] px-[3rem]
    //       text-lg
    //       backdrop-blur-2xl
    //     "
    // >
    //   <div>
    //     <a href="#">
    //       <p className="text-4xl font-bold">O<span className="text-[#00857D]">T</span>C</p>
    //     </a>
    //   </div>

    //   <svg
    //     xmlns="http://www.w3.org/2000/svg"
    //     id="menu-button"
    //     className="h-6 w-6 cursor-pointer md:hidden block"
    //     fill="none"
    //     viewBox="0 0 24 24"
    //     stroke="currentColor"
    //   >
    //     <path
    //       stroke-linecap="round"
    //       stroke-linejoin="round"
    //       stroke-width="2"
    //       d="M4 6h16M4 12h16M4 18h16"
    //     />
    //   </svg>

    //   <div
    //     className="hidden w-full md:flex md:items-center md:w-auto"
    //     id="menu"
    //   >
    //     <ul
    //       className="
    //           pt-4
    //           text-base 
    //           md:flex
    //           md:justify-between 
    //           md:pt-0"
    //     >
    //       <li>
    //         <a className="md:p-4 py-2 block hover:text-purple-400" href="#">
    //           Features
    //         </a>
    //       </li>
    //       <li>
    //         <a className="md:p-4 py-2 block hover:text-purple-400" href="#">
    //           Pricing
    //         </a>
    //       </li>
    //       <li>
    //         <a className="md:p-4 py-2 block hover:text-purple-400" href="#">
    //           Customers
    //         </a>
    //       </li>
    //       <li>
    //         <a className="md:p-4 py-2 block hover:text-purple-400" href="#">
    //           Blog
    //         </a>
    //       </li>
    //       <li>
    //         <a
    //           className="md:p-4 py-2 block hover:text-purple-400 text-purple-500"
    //           href="#"
    //         >
    //           Sign Up
    //         </a>
    //       </li>
    //     </ul>
    //   </div>
    // </nav>

    // <nav className="sticky left-0 top-0
    // items-center
    // flex flex-wrap
    // justify-between
    // w-full
    // py-4
    // md:py-0
   
    // text-lg
    // backdrop-blur-2xl 
    // sys-app-notCollapsed
    // ">
  
      
    //       {/* <div className=" w-full flex flex-wrap sys-app-notCollapsed pb-0 py-2 px-2 mx-auto "> */}
    //         <div
    //           className="flex w-full justify-between "
    //         >
    //           {/* Logo */}
    //           <div>
    //             <p onClick={()=>{
    //               router.push("/home1")
    //             }} className="text-4xl font-bold cursor-pointer">
    //               O<span>T</span>C
    //             </p>
    //           </div>
    //           <ul className="ml-10 md:flex items-baseline space-x-4 hidden">
    //             {items.map((item, index) => (
    //               <Link
    //                 key={index}
    //                 href={item.href}
    //                 onClick={() => setActiveLink(index)}
    //                 className={`relative px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 rounded-lg`}
    //               >
    //                 <p
    //                   className={`relative px-3 py-2 text-sm font-medium text-white hover:bg-gray-700
    //         ${activeLink === index ? "border-b-2 border-white" : ""}
    //         `}
    //                 >
    //                   {item.label}
    //                 </p>
    //               </Link>
    //             ))}
    //           </ul>

    //           {/* Hamberger Menu  */}
    //           <div className=" ml-auto md:hidden transition-all mr-3 my-3 cursor-pointer hover:text-gray-700">
    //             {isMobileNavOpen ? (
    //               <AiOutlineMenuFold
    //                 onClick={() => setisMobileNavOpen(false)}
    //                 className="rounded text-2xl"
    //               />
    //             ) : (
    //               <AiOutlineMenuUnfold
    //                 onClick={() => setisMobileNavOpen(true)}
    //                 className="rounded text-2xl"
    //               />
    //             )}
    //           </div>
    //         </div>
         

    //       {/* Mobile Navbar */}
    //        <div
    //         id="navbar"
    //         className={`pt-0 absolute top-2 z-100 mx-auto ${
    //           isMobileNavOpen ? "translate-x-0" : "-translate-x-full hidden"
    //         } transition-all flex-wrap`}
    //       >
    //         <div className="py-[.5px] w-64">
    //           <div className="w-full py-4 space-y-6 px-2 text-gray-900 bg-white rounded-lg min-h-screen  text-left capitalize font-medium shadow-lg">
    //             {/* Logo */}
    //             <img
    //               src="https://www.freepnglogos.com/uploads/spotify-logo-png/file-spotify-logo-png-4.png"
    //               alt="alt placeholder"
    //               className="w-8 h-8 mx-auto mb-5 "
    //             />

    //             {/* Links */}
    //             {navLinks?.map(({ title, link, icon }, id) => (
    //               <Link key={id} href={link}>
    //                 <p
    //                   id={id}
    //                   className={`px-2 flex items-center cursor-pointer hover:bg-gray-200 hover:text-gray-700 text-sm rounded ${
    //                     router.pathname == link
    //                       ? "text-gray-700 font-semibold"
    //                       : ""
    //                   }`}
    //                 >
    //                   <span className="p-2 bg-gray-200 rounded-full">
    //                     {icon}
    //                   </span>
    //                   <span className="mx-1">{title}</span>
    //                 </p>
    //               </Link>
    //             ))}

    //             {/* After all nav links if you want any button or link then it will come here */}
    //             <div></div>
    //           </div>
    //         </div>
    //       </div>
    // </nav>
  );
};

export default Navbar;
