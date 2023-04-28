import Image from "next/image";
const LandingCard2 = () => {
  return (
    <div className="border border-gray-600 p-4 sm:p-4 md:p-8 lg:p-8 xl:p-8 mx-auto  rounded-xl my-4 w-[10rem]  md:w-[15rem] lg:w-[20rem] xl:w-[20rem] h-[10rem] md:h-[15rem] lg:h-[20rem] xl:h-[20rem] bg-[#003A30]/5 backdrop-blur-md shadow-md flex flex-col">
      <div className="relative">
        <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 absolute top-1/2 -left-8 md:-left-12 lg:-left-14 xl:-left-16">
          <Image
            src="/graph.png" // change this later on
            alt="up-arrow!"
            width="60"
            height="60"
            sizes="100vw"
          />
        </div>
        <p className="text-xs sm:text-md md:text-base lg:text-lg xl:text-xl">
          You will receive
        </p>
        {/* <div className="flex my-5">
        <div className="relative text-xs md:text-sm lg:text-md xl:text-lg">
          <div>
            <div
              className="flex circle   rounded-full bg-black justify-center items-center  border-2 border-gray-500 
            h-[6rem] w-[6rem]
            md:h-[7rem] md:w-[7rem]
            lg:h-[8rem] lg:w-[8rem]
            
            "
            >
              <strong className="text-center">
                $166.04979 <br /> <p className="font-thin">DAI</p>
              </strong>
            </div>
            <div
              className="absolute circle flex  rounded-full bg-black justify-center items-center border-2 border-gray-500 
              top-0 right-[-3rem]
              md:right-[-4rem]
            h-[4rem] w-[4rem]
            md:h-[5rem] md:w-[5rem]
            lg:h-[6rem] lg:w-[6rem]
            ">
              <strong className="text-center">
                $13.43 <br /> <p className="font-thin">ETH</p>
              </strong>
            </div>
            <div
              className="absolute circle flex  rounded-full bg-black justify-center items-center border-2 border-gray-500 
            bottom-[-2rem] right-[-3rem] 
            md:bottom-[-3rem] md:right-[-5 rem]
            h-[5rem] w-[5rem]
            md:h-[6rem] md:w-[6rem]
            "
            >
              <strong className="text-center">
                $16,830.34 <br /> <p className="font-thin">USDT</p>
              </strong>
            </div>
          </div>
        </div>
      </div> */}
        <div className="block min-h-fit 2xl:block xl:block lg:block md:block">
          <Image
            src="/landingCard2grp.png" // change this later on
            alt="cube"
            width="300"
            height="300"
            sizes="100vw"
          />
        </div>
      </div>
    </div>
  );
};

export default LandingCard2;
