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
}: ButtonProps) => (
	<button
		type="button"
		className={`group w-[70%] font-bold rounded-lg  bg-[#00FFB2] px-4 py-2 text-[#132021] transition-all duration-300 ease-in-out hover:scale-105 hover:bg-[#8cffddfe] focus:outline-none  ${className}`}
		{...buttonProps}
	>
		{text}
	</button>
);
