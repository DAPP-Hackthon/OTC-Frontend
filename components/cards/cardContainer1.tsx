interface CardProps {
  children: React.ReactNode;
  className?: string;
  balance?: number;
  onClick?: () => void;
}

const CardContainer = ({
  children,
  className = "",
  balance,
  onClick,
}: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl  mx-auto sm:w-full md:w-full lg:w-[30rem] xl:w-[30rem] justify-center bg-[#003A30]/30 p-8 shadow-md flex flex-col ${className}`}
    >
      <div>{children}</div>
      {/* footer */}
      <div className="flex mt-auto justify-between items-center">
        <div className="text-md text-gray-500"></div>
        {balance && <small>Available Balance: {balance}</small>}
      </div>
    </div>
  );
};

export default CardContainer;
