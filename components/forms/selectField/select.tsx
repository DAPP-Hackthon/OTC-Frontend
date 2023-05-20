/* eslint-disable react/require-default-props */
import React from "react";
import { IOption, Option } from "./option";

export interface SelectFieldProps {
  label?: string;
  name: string;
  error?: string | null;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: number;
  className?: string;
  options: Array<IOption>;
  onChange?: (_event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select = ({
  label,
  name,
  onChange,
  error = null,
  options = [],
  className = "",
  ...selectProps
}: SelectFieldProps) => {
  return (
    <div className="flex-grow">
      {/* <label htmlFor={name} className="text-md">
				{label}
				{error && (
					<span className="text-sm italic text-red-500">{` :${error}`}</span>
				)}
			</label> */}
      <label className="text-md mb-3">{label}</label>
      <br />
      <div>
        <select
          key={name}
		  
          defaultValue=""
          name={name}
          onChange={onChange}
          placeholder="Select an option"
          className={` text-sm mt-2 z-50 w-full h-[3rem] flex items-center justify-between rounded-2xl  bg-[#004A3D]/50 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none${className}
					${error ? "border-red-500" : "focus:border-indigo-500"}`}
          {...selectProps}
        >
          {options.map((op) => (
            <Option key={op.value} {...op} />
            // <div key={op.value} {...op} >
            //   <p className="text-sm cursor-pointer px-4 py-2 text-gray-300 transition-colors duration-300 ease-in-out hover:bg-gray-800 hover:text-white">
            //     {op.text}
            //   </p>
            // </div>
          ))}
        </select>
      </div>
    </div>
  );
};
