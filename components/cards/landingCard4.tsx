import Image from "next/image";

interface CardProps {
    // children: React.ReactNode;
    index: string;
    heading: string;
    description: string;
  }

const LandingCard4 = ({
index,
heading,
description,
}: CardProps) => {
  return (
    <div className="flex my-[5%] backdrop-blur-md rounded-[1.3rem] xl:rounded-[1.3rem] 3xl:rounded-[2.3rem] 4xl:rounded-[4.3rem] bg-white/5 py-[3%] px-[10%] gap-[7%]">
    <div className="font-gilroy font-bold   whitespace-nowrap">
      <span className=" text-[4rem] blur-[3px] md:blur-[5px] 2xl:blur-[8px] 4xl:blur-[10px] md:text-[8rem] 2xl:text-[8rem] 4xl:text-[16rem]  text-[#01f5ab]">{index}</span>
    </div>
    <div className="self-center font-gilroy ">
      <span className=" text-[0.6rem] xs:text-sm sm:text-base md:text-lg xl:text-lg 2xl:text-2xl 3xl:text-4xl 4xl:text-7xl font-bold">{heading}</span>
      <div className="spantext-base-1 mt-[2%]">
        <p className="text-[9px] xs:text-sm sm:text-base md:text-lg  2xl:text-[1.3rem] 3xl:text-3xl 4xl:text-6xl leading-3 sm:leading-4 3xl:leading-tight align-text-middle">
         {description}
        </p>
      </div>
    </div>
  </div>
  );
};

export default LandingCard4;
