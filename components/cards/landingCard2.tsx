import Image from "next/image";
const LandingCard2 = () => {
  return (
    <div
      className="border aspect-square xl:aspect-auto h-auto border-gray-600 p-4 sm:p-4 md:p-8 lg:p-8 xl:p-4 3xl:p-8 4xl:p-12 mx-auto  rounded-3xl 3xl:rounded-[3rem]  my-4 
      w-full xl:w-[60%] 3xl:w-[55%]
    xl:h-auto bg-[#00FFA3]/10 backdrop-blur-md shadow-md flex flex-col"
    >
      <div className="relative">
        <Image
          src="/pie.png" // change this later on
          alt="up-arrow!"
          width="0"
          height="0"
          sizes="100vw"
          className="w-[2rem] h-auto sm:w-[3rem] lg:w-[5rem]  xl:w-[3rem] 2xl:w-[3rem] 3xl:w-[6rem] 4xl:w-[8rem]
           aspect-square sm:block md:block lg:block xl:block 
            md:w-10    absolute top-1/3 -left-8 md:-left-16 lg:-left-20 xl:-left-14 2xl:-left-18 3xl:-left-24 4xl:-left-[8rem] "
        />

        <p className="text-sm xs:text-lg sm:text-lg md:text-lg lg:text-xl xl:text-xl  2xl:text-2xl 3xl:text-4xl 4xl:text-5xl mb-5">
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
        {/* <div className=""> */}
        <Image
          src="/landingCard2grp.png" // change this later on
          alt="cube"
          width="0"
          height="0"
          sizes="100vw"
          className=" min-h-fit h-auto w-full"
        />
        {/* </div> */}
      </div>
    </div>
  );
};

export default LandingCard2;
