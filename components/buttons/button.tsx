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
		className={`group w-full rounded-lg bg-gradient-to-br from-blue-500 to-blue-900 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:scale-105 hover:bg-blue-500 focus:outline-none  ${className}`}
		{...buttonProps}
	>
		{text}
	</button>
);
