import { InputField } from "../forms/inputField";
import Image from "next/image";
interface CardProps {
  // children: React.ReactNode;
  className?: string;
  balance?: number;
  sampleData: string;
  // index:number;
  viewStyle?: boolean;
  onClick?: () => void;
}

const CardContainer2 = ({
  // children,
  // index,
  sampleData,
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
          className={`rounded-xl my-4 sm:w-full md:w-full lg:w-[30rem] xl:w-[30rem] justify-center bg-[#003A30]/30 shadow-md flex flex-col ${className}`}
        >
          {/* header */}
          <div className="flex w-full bg-[#004A3D] mb-auto items-center px-4 py-2 rounded-t-xl ">
            <div className="text-md text-gray-500"></div>
            <p>{sampleData}</p>
          </div>
          {/* body */}
          <div className="rounded-b-xl pb-4 bg-[#003A30]">
            <div className="px-4 py-2 grid gap-y-2">
              <div className="flex text-sm flex-wrap justify-between">
                <div>
                  <p>Gives: </p>
                  <p>(Money value)</p>
                </div>
                <div>
                  <p>Receives: </p>
                  <p>(Money value)</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-between">
                <div className="text-sm mt-2 z-50 w-1/3 h-[2rem] flex items-center justify-between rounded-2xl  bg-white/20 px-4 py-2 text-white">
                  <p>Eth</p>
                </div>
                <div className="text-sm mt-2 z-50 w-1/3 h-[2rem] flex items-center justify-between rounded-2xl  bg-white/20 px-4 py-2 text-white">
                  <p>USDT</p>
                </div>
              </div>
              <div className="text-sm mt-2 z-50 h-[2rem] flex items-center justify-between rounded-2xl  bg-white/5 px-4 py-2 text-white">
                <p>Direct Trade</p>
                <p>Date: 12/02/23</p>
              </div>
              <div className="text-sm mt-2 z-50 h-[2rem] flex items-center justify-between rounded-2xl  bg-white/5 pl-4 py-2 text-white">
                <p>24h Volume ~ xxxxxxx</p>
                <Image
                  src="/right.png" // change this later on
                  alt="right-arrow!"
                  width="30"
                  height="20"
                  sizes="100vw"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={onClick}
          className={`rounded-xl my-4 sm:w-full md:w-full lg:w-full xl:w-full justify-center bg-[#003A30]/30 shadow-md flex flex-col ${className}`}
        >
          {/* header */}
          <div className="flex justify-evenly h-fit w-full bg-[#004A3D] mb-auto items-center px-4 py-2 rounded-xl ">
            <div>
              <p>Gives: </p>
              <p>(Money value)</p>
            </div>
            <div>
              <p>Gives: </p>
              <p>(Money value)</p>
            </div>
            <div>
              <p>Receives: </p>
              <p>(Money value)</p>
            </div>
            <div>
              <p>Date: 12/02/23</p>
            </div>
            <div>
              <p>24h Volume ~ xxxxxxx</p>
            </div>
            <div>
              <Image
                src="/right.png" // change this later on
                alt="right-arrow!"
                width="30"
                height="20"
                sizes="100vw"
              />
            </div>
          </div>
          {/* body */}

          {/* <div className="rounded-b-xl pb-4 bg-[#003A30]">
          <div className="px-4 py-2 grid gap-y-2">
            <div className="flex text-sm flex-wrap justify-between">
              <div>
                <p>Gives: </p>
                <p>(Money value)</p>
              </div>
              <div>
                <p>Receives: </p>
                <p>(Money value)</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-between">
              <div className="text-sm mt-2 z-50 w-1/3 h-[2rem] flex items-center justify-between rounded-2xl  bg-white/20 px-4 py-2 text-white">
                <p>Eth</p>
              </div>
              <div className="text-sm mt-2 z-50 w-1/3 h-[2rem] flex items-center justify-between rounded-2xl  bg-white/20 px-4 py-2 text-white">
                <p>USDT</p>
              </div>
            </div>
            <div className="text-sm mt-2 z-50 h-[2rem] flex items-center justify-between rounded-2xl  bg-white/5 px-4 py-2 text-white">
              <p>Direct Trade</p>
              <p>Date: 12/02/23</p>
            </div>
            <div className="text-sm mt-2 z-50 h-[2rem] flex items-center justify-between rounded-2xl  bg-white/5 pl-4 py-2 text-white">
              <p>24h Volume ~ xxxxxxx</p>
              <Image
                src="/right.png" // change this later on
                alt="right-arrow!"
                width="30"
                height="20"
                sizes="100vw"
              />
            </div>
          </div>
        </div> */}
        </div>
      )}
    </div>
  );
};

export default CardContainer2;
