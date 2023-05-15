/* eslint-disable react/require-default-props */

export interface IOption {
	value: any;
	text: string;
	disabled?: boolean;
	selected?: boolean;
	className?: string;
}

export const Option = ({ value, text, ...optionProps }: IOption) => (
	<option
		className="absolute z-40 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-700 bg-gray-900 shadow-lg"
		value={value}
		{...optionProps}
	>
		<p className="text-sm cursor-pointer px-4 py-2 text-gray-300 transition-colors duration-300 ease-in-out hover:bg-gray-800 hover:text-white">
			{text}
		</p>
	</option>
);
