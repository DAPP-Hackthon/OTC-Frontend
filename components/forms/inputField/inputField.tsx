/* eslint-disable react/require-default-props */

export interface InputFieldProps {
	label: string;
	placeholder: string;
	name: string;
	// error: string | null;
	type?: "text" | "number";
	value?: string | number;
	disabled?: boolean;
	required?: boolean;
	className?: string;
	// onChange?: (_event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField = ({
	label,
	name,
	placeholder,
	// error = null,
	className = "",
	type = "text",
	...inputProps
}: InputFieldProps) => (
	<div>
		<label htmlFor={name} className="text-md ">
			{label}	
		</label>
		<br />
		<input
			type={type}
			name={name}
			placeholder={placeholder}
			className="text-sm mt-2 z-50 w-full h-[3rem] flex items-center justify-between rounded-2xl  bg-white/20 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none "
            // className={`text-sm text-white mx-4 mb-1 h-[3rem] min-w-full rounded-2xl  bg-white/20 p-1 pl-[0.75rem] selection:bg-red-500 focus:outline-none focus:border-indigo-500 ${className}`}
			{...inputProps}
		/>
	</div>
);
