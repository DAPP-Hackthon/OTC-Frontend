import Image from "next/image";

interface CardProps {
    // children: React.ReactNode;
    heading: string;
    imageSrc: string;
    description: string;
  }

const LandingCard3 = ({
heading,
imageSrc,
description,
}: CardProps) => {
  return (
    <div className="bg-white/5 lg:m-[2rem] w-[15rem] lg:w-[22rem] border-[0.5px] border-[#A4A4A4] backdrop-blur-md rounded-2xl p-[2rem] transform transition-transform duration-300 hover:scale-105">
          <div className="flex gap-x-6 items-center">
            <Image
              src={imageSrc} // change this later on
              alt="cube"
              width="0"
              height="0"
              sizes="100vw"
              className="relative h-[2rem] lg:h-[3rem] w-auto aspect-square self-center"
            />
            <span className="lg:text-3xl font-semibold">{heading}</span>
          </div>
          <p className="text-xs lg:text-base mt-4">
          {description}
          </p>
        </div>
  );
};

export default LandingCard3;
