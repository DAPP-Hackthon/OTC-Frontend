/* eslint-disable react/require-default-props */

export interface ButtonProps {
  text: string | React.ReactNode;
  type?: "button" | "submit" | "reset" | undefined;
  stretch?: boolean;
  disabled?: boolean;
  name?: string;
  className?: string;
  onClick?: (_event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button = ({
  text,
  className = "",
  ...buttonProps
}: ButtonProps) => {
	// function addOverLay(e) {
	// 	let item = document.querySelector(".primary-button .round");
	// 	e.target.addEventListener("mouseenter", function (event) {
	// 	  this.classList += " animate";
	
	// 	  let buttonX = event.offsetX;
	// 	  let buttonY = event.offsetY;
	
	// 	  if (buttonY < 24) {
	// 		item.style.top = 0 + "px";
	// 	  } else if (buttonY > 30) {
	// 		item.style.top = 48 + "px";
	// 	  }
	
	// 	  item.style.left = buttonX + "px";
	// 	  item.style.width = "1px";
	// 	  item.style.height = "1px";
	// 	});
	
	// 	e.target.addEventListener("mouseleave", function (event) {
	// 	  this.classList.remove("animate");
	
	// 	  let buttonX = event.offsetX;
	// 	  let buttonY = event.offsetY;
	
	// 	  if (buttonY < 24) {
	// 		item.style.top = 0 + "px";
	// 	  } else if (buttonY > 30) {
	// 		item.style.top = 48 + "px";
	// 	  }
	// 	  item.style.left = buttonX + "px";
	// 	});
	//   }
  return (
    <button
      type="button"
	//   onMouseOver={addOverLay}
      className={`primary-button group w-[70%] font-bold rounded-lg  bg-[#00FFB2] px-4 py-2 text-[#132021] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#8cffddfe] focus:outline-none  ${className}`}
      {...buttonProps}
    >
      {text}
    </button>
  );
};
