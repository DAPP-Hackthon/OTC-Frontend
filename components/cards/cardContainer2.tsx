import { InputField } from "../forms/inputField";
import Image from "next/image";
import { TbSquareRoundedArrowRightFilled } from "react-icons/tb";

interface CardProps {
  // children: React.ReactNode;
  className?: string;
  balance?: number;
  receivedFrom: string;
  sellAmount: number;
  buyAmount: number;
  chainId: number;
  // index:number;
  viewStyle?: boolean;
  onClick?: () => void;
}

const CardContainer2 = ({
  // children,
  // index,
  receivedFrom,
  sellAmount,
  buyAmount,
  chainId,
  viewStyle,
  className = "",
  balance,
  onClick,
}: CardProps) => {
  return (
    <div>
      {viewStyle ? (
        <div
          onClick={onClick}
          className={`rounded-xl font-poppins border border-[#c8c8c86a] my-4 sm:w-full md:w-full lg:w-[30rem] xl:w-[30rem] justify-center bg-[#003A30]/30 shadow-md flex flex-col ${className}`}
        >
          {/* body */}
          <div className="rounded-xl pb-4 backdrop-blur-lg">
            <div className="px-4 py-4 grid gap-y-2">
              <div className="flex text  justify-between">
                <div>
                  <p className="">You Gave</p>
                </div>
                <div>
                  <p className="">You Received</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-[12px] w-[12rem]  mt-2 z-50 flex items-center rounded-2xl  bg-white/5 px-4 py-2 text-white">
                  <div className="bg-white/5 p-2 rounded-md">
                    <Image
                      src="/binancedex.png"
                      alt="binance"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="ml-3">
                    <span className="font-bold text-base text-[#E03232]">
                      - {sellAmount} BNB
                    </span>

                    <p className="text-[#828282]">
                      {chainId == 80001
                        ? "Polygon Mumbai"
                        : chainId === 7001
                        ? "Zetachain Athens 2"
                        : chainId == 97
                        ? "Binance Testnet"
                        : chainId === 5
                        ? "Goerli Testnet"
                        : "Unsupported Chain"}
                    </p>
                  </div>
                </div>
                <div>
                  <Image
                    src="/rightArrow.png"
                    alt="rightArrow"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="h-5 w-5"
                  />
                </div>
                <div className="text-[12px] w-[12rem] mt-2 z-50 flex items-center rounded-2xl  bg-white/5 px-4 py-2 text-white">
                  <div className="bg-white/5 p-2 rounded-md">
                    <Image
                      src="/eth.png"
                      alt="ethereum"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="ml-3">
                    <span className="font-bold text-base text-[#09CD93]">
                      + {buyAmount} ETH
                    </span>
                    <p className="text-[#828282]">
                      {" "}
                      {chainId == 80001
                        ? "Polygon Mumbai"
                        : chainId === 7001
                        ? "Zetachain Athens 2"
                        : chainId == 97
                        ? "Binance Testnet"
                        : chainId === 5
                        ? "Goerli Testnet"
                        : "Unsupported Chain"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="text-[12px] mt-2 z-50 w-[47%]  flex items-center justify-between rounded-2xl  bg-white/5 px-4 py-2 text-white">
                  <p className="">
                    Type :{" "}
                    <span className="text-[#BFBFBF] font-normal">
                      Direct Normal Swap
                    </span>
                  </p>
                </div>
                <div className="text-[12px]  mt-2 z-50 w-[47%]  flex items-center justify-between rounded-2xl  bg-white/5 px-4 py-2 text-white">
                  <p className="">
                    Date :{" "}
                    <span className="text-[#BFBFBF] font-normal">
                      05/01/2023, 10.22.30 AM
                    </span>
                  </p>
                </div>
              </div>

              <div className="text-[12px] mt-2 z-50  flex items-center justify-between rounded-2xl  bg-white/5 pl-4 py-2 text-white">
                <p className="">
                  Received From:{" "}
                  <span className="text-[#BFBFBF] font-normal">
                    {receivedFrom}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={onClick}
          className={`rounded-xl border border-[#c8c8c86a] my-4 sm:w-full md:w-full lg:w-full xl:w-full justify-center backdrop-blur-lg shadow-md flex flex-col ${className}`}
        >
          {/* header */}
          <div className="flex justify-between h-fit w-full  mb-auto items-center px-4 py-4 rounded-xl ">
            <div className="flex flex-wrap w-[45%] items-center justify-between">
              <div>
                <p>You gave</p>
                <div className="text-sm mt-2 z-50 w-[12rem] flex items-center  rounded-2xl  bg-white/5 px-4 py-2 text-white">
                  <div className="bg-white/5 p-2 rounded-md">
                    <Image
                      src="/binancedex.png"
                      alt="binance"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="ml-3 text-center">
                    <span className="font-bold text-base text-[#E03232]">
                      - {sellAmount} BNB
                    </span>
                    <p className="text-[#828282]">
                      {" "}
                      {chainId == 80001
                        ? "Polygon Mumbai"
                        : chainId === 7001
                        ? "Zetachain Athens 2"
                        : chainId == 97
                        ? "Binance Testnet"
                        : chainId === 5
                        ? "Goerli Testnet"
                        : "Unsupported Chain"}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Image
                  src="/rightArrow.png"
                  alt="rightArrow"
                  width="0"
                  height="0"
                  sizes="100vw"
                  className="h-5 w-5 mx-5 mt-8"
                />
              </div>
              <div>
                <p>You Received</p>
                <div className="text-sm mt-2 z-50 w-[12rem] flex items-center rounded-2xl  bg-white/5 px-4 py-2 text-white">
                  <div className="bg-white/5 p-2 rounded-md">
                    <Image
                      src="/eth.png"
                      alt="ethereum"
                      width="0"
                      height="0"
                      sizes="100vw"
                      className="h-5 w-5"
                    />
                  </div>
                  <div className="ml-3 text-center">
                    <span className="font-bold text-base text-[#09CD93]">
                      + {buyAmount} ETH
                    </span>
                    <p className="text-[#828282]">
                      {" "}
                      {chainId == 80001
                        ? "Polygon Mumbai"
                        : chainId === 7001
                        ? "Zetachain Athens 2"
                        : chainId == 97
                        ? "Binance Testnet"
                        : chainId === 5
                        ? "Goerli Testnet"
                        : "Unsupported Chain"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[45%]">
              <div className="flex flex-wrap justify-between">
                <div className="text-sm mt-2 z-50 w-[45%] h-[2rem] flex items-center justify-between rounded-xl  bg-white/5 px-4 py-2 text-white">
                  <p className="font-semibold">
                    Type :{" "}
                    <span className="font-normal">Direct Normal Swap</span>
                  </p>
                </div>
                <div className="text-sm mt-2 z-50 w-[45%] h-[2rem] flex items-center justify-between rounded-xl  bg-white/5 px-4 py-2 text-white">
                  <p className="font-semibold">
                    Date :{" "}
                    <span className="font-normal">05/01/2023, 10.22.30 AM</span>
                  </p>
                </div>
              </div>

              <div className="text-sm mt-2 z-50 h-[2rem] flex items-center justify-between rounded-xl  bg-white/5 pl-4 py-2 text-white">
                <p className="font-semibold">
                  Received From:{" "}
                  <span className="font-normal">{receivedFrom}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardContainer2;
