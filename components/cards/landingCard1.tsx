import Image from "next/image";
import {BsArrowUp} from "react-icons/bs"

const LandingCard1 = () => {
  return (
    <div className="border aspect-[16/11] border-gray-600 p-4 sm:p-4 md:p-8 lg:p-8 xl:p-4 3xl:p-8 card custom-background mx-auto rounded-xl my-4 
    w-[70%] md:w-[50%] xl:w-[75%]
    h-auto  backdrop-blur-md bg-[#00FFA3]/10 shadow-md flex flex-col">
      <div className="relative">
        {/* <div className="hidden sm:block md:block lg:block xl:block w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 absolute -top-8 -right-8 md:-top-12 md:-right-12 lg:-top-14 lg:-right-14"> */}
          <Image
            src="/graph.png" // change this later on
            alt="up-arrow!"
            width="0"
            height="0"
            sizes="100vw"
            className="sm:block md:block lg:block xl:block 
            w-[2rem] h-auto sm:w-[3rem] lg:w-[5rem]  xl:w-[3rem] 2xl:w-[5rem] 3xl:w-[6rem]  aspect-square md:w-10 absolute -top-8 -right-8 md:-top-12 md:-right-12 lg:-top-14 3xl:-top-20 lg:-right-14 xl:-top-10 xl:-right-10 3xl:-right-14"
          />
        {/* </div> */}
        <div>
          <p className="mb-2 text-sm xs:text-lg sm:text-lg md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl 3xl:text-5xl  ">
            You will pay
          </p>
          <p className="mb-2 whitespace-nowrap text-xl xs:text-2xl md:text-4xl lg:text-5xl xl:text-3xl 2xl:text-4xl 3xl:text-7xl  font-bold">
            0000.081
            <span className="text-sm md:text-2xl lg:text-3xl xl:text-xl 2xl:text-2xl 3xl:text-5xl text-[#FCED2F]">{" "}BTC </span>
          </p>
          <div className="flex">
            <div className="self-center">
              {/* <Image
                src="/arrowUp.png" // change this later on
                alt="up-arrow!"
                width="8"
                height="8"
                sizes="100vw"
              /> */}
              
            </div>{" "}
            <small className="font-light flex text-[9.5px] md:text-base lg:text-lg xl:text-base 2xl:text-lg 3xl:text-4xl 3xl:whitespace-nowrap">
             
             <BsArrowUp />
              {" "}
              0.65% in this month
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingCard1;
