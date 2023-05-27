/* eslint-disable react/require-default-props */

export interface InputFieldProps {
	label?: string;
	placeholder: string;
	name: string;
	error?: string;
	type?: "text" | "number";
	value?: string | number;
	disabled?: boolean;
	required?: boolean;
	className?: string;
	touched?: boolean;
	handleChange?: (_event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField = ({
	label,
	name,
	placeholder,
	error,
	className = "",
	type,
	disabled,
	value,
	touched,
	handleChange,
	...inputProps
}: InputFieldProps) => (
	<div>
		<label htmlFor={name} className="text-md ">
			{label}	
			{error && touched && (
				<span className="text-sm italic text-red-500">{` :${error}`}</span>
			)}
		</label>
		<br />
		<input
			type={type}
			name={name}
			// disabled="false"
			value={value}
			placeholder={placeholder}
			className={`text-sm appearance-none mt-2 z-50 w-full h-[3rem] flex items-center justify-between rounded-2xl  bg-[#004A3D]/50 px-4 py-2 text-white focus:outline-none
			${disabled? "opacity-50 cursor-not-allowed":""}
			${error ? "border-red-500" : "focus:border-indigo-500"}`}
            onChange={handleChange}
			{...inputProps}
		/>
		
		
	</div>
);
