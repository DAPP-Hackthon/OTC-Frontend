import Image from "next/image";
const LandingCard1 = () => {
  return (
    <div className="border border-gray-600 p-4 sm:p-4 md:p-8 lg:p-8 xl:p-8  card custom-background mx-auto rounded-xl my-4 w-[10rem]  md:w-[15rem] lg:w-[20rem] xl:w-[20rem] h-[10rem] md:h-[15rem] lg:h-[20rem] xl:h-[20rem] backdrop-blur-md bg-[#003A30]/5 shadow-md flex flex-col">
      <div className="relative">
        <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 absolute -top-8 -right-8 md:-top-12 md:-right-12 lg:-top-14 lg:-right-14">
          <Image
            src="/graph.png" // change this later on
            alt="up-arrow!"
            width="60"
            height="60"
            sizes="100vw"
          />
        </div>
        <div>
          <p className="mb-2 text-xs sm:text-md md:text-base lg:text-lg xl:text-xl">
            You will pay
          </p>
          <p className="mb-2 text-xl whitespace-nowrap md:text-2xl lg:text-2xl xl:text-3xl font-bold">
            00000.01
            <span className="text-lg xl:text-xl text-[#FCED2F] ml-3">BTC </span>
          </p>
          <div className="flex">
            <div className="self-center">
              <Image
                src="/arrowUp.png" // change this later on
                alt="up-arrow!"
                width="8"
                height="8"
                sizes="100vw"
              />
            </div>{" "}
            <small className="font-light text-xs md:text-sm lg:text-base xl:text-base"> 0.65% in this month</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingCard1;
