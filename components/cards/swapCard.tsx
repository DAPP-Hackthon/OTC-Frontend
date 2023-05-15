import Image from "next/image";

type CardProps = {
  title: string;
  description: string;
  buttonText: string;
  imageUrl: string;
  // onClick: () => void;
};

const SwapCard: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
}) => {
  return (
    <div className="bg-[#004A3D] font-poppins h-[12.5rem] w-[16rem] rounded-2xl shadow-md p-2">
      <div className="relative h-28 rounded-2xl overflow-hidden mb-1">
        <Image
          src={imageUrl} // change this later on
          alt="nftImage!"
          width="0"
          height="0"
          sizes="100vw"
          className="w-full"
        />
      </div>
      <div className="flex mb-1 justify-between bg-[#003F33] px-3 py-2 rounded-xl">
        <div className="leading-[6px]">
          <p className="text-[10px] font-extralight">{title}</p>
          <small className="text-[6px] font-extralight">NFT Code No</small>
        </div>
        <p className="text-[10px] font-extralight self-center">
          Price: 2.145 ETH
        </p>
      </div>
      <div className="flex justify-between bg-[#003F33] px-3 py-1 rounded-xl">
        <div className="my-auto flex">
          <button className="self-center primary-button group rounded-2xl text-[10px] font-normal whitespace-nowrap bg-[#00FFB2] px-4 py-1 text-[#132021] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#8cffddfe] focus:outline-none  ">
            Select NFT
          </button>
        </div>
        <p className="text-[10px] font-extralight self-center">24h Vol: xxx</p>
      </div>
    </div>
  );
};

export default SwapCard;
