interface CardProps {
  children: React.ReactNode;
  className?: string;
  balance?: number;
  onClick?: () => void;
}

const CardContainer3 = ({
  children,
  className = "",
  balance,
  onClick,
}: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl 3xl:rounded-[3rem] 4xl:rounded-[5rem] z-20 h-48 3xl:h-[20rem] 4xl:h-[40rem]  border border-[#c8c8c86a] mx-auto sm:w-full md:w-full lg:w-full justify-center backdrop-blur-lg p-8 shadow-md flex flex-col ${className}`}
    >
      <div className="m-auto">
        <div>{children}</div>
        {/* footer */}
        <div className="flex mt-auto justify-between items-center">
          <div className="text-md text-gray-500"></div>
          {balance && <small>Available Balance: {balance}</small>}
        </div>
      </div>
    </div>
  );
};

export default CardContainer3;
