import React, { FormEvent, useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";
import CardContainer from "../../components/cards/cardContainer1";
import { InputField } from "../../components/forms/inputField";
import { Button } from "../../components/buttons/button";
import Image from "next/image";
import { TradeType } from "@/sampleData/data";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select } from "@/components/forms/selectField/select";
import axios from "axios";
import { signMessage, signTypedData } from "@wagmi/core";
import Cookies from "universal-cookie";
import ethers from "ethers"
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { getAddress } from "viem";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
type Option = {
  value: string;
  label: string;
};

interface CustomElements extends HTMLFormControlsCollection {
  send: HTMLTextAreaElement;
  yourAsset: HTMLSelectElement;
  partnerAsset: HTMLSelectElement;
  receive: HTMLSelectElement;
  visibility: HTMLSelectElement;
  tradeType: HTMLSelectElement;
  // myCustomDropdownButton: HTMLButtonElement;
}

interface NewCourseFormElements extends HTMLFormElement {
  readonly elements: CustomElements;
}
export const directSchema = Yup.object().shape({
  send: Yup.number().min(3).required().typeError("price must be a number"),
  receive: Yup.number().min(3).required().typeError("price must be a number"),
  yourAsset: Yup.string().required("Field is required!"),
  visibility: Yup.string().required("Field is required!"),
  tradeType: Yup.string().required("Field is required!"),
});

const DirectTrade = ({ children, className = "", onClick }: CardProps) => {
  const cookies = new Cookies();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedOption1, setSelectedOption1] = useState<Option>();
  const [errors, setErrors] = useState<{ [k: string]: string | null }>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const accessToken = cookies.get("access_token");
  const { isConnected, address } = useAccount({
    onConnect({ address }) {
      if (!address) return;
      // handleTokens(address);
    },
  });
  // const { data, isError, isSuccess, signMessage } = useSignMessage();
  const handleSelectOption = (option: string, value: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    router.push(`/tradeType/${value}`);
  };

  const visibility = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" },
  ];
  const tradeType = [
    { value: "direct", label: "Direct" },
    { value: "fractional", label: "Fractional" },
  ];
  const assetType = [
    { value: "0x8b9c35c79af5319c70dd9a3e3850f368822ed64e", label: "ETH" },
  ];

  const handleChange = async (
    e: React.ChangeEvent<HTMLElement & { name: string }>
  ) => {
    const elements = formRef.current?.elements as CustomElements;
    console.log(elements.visibility.value);
    setIsDisable(elements.visibility.value === "1" ? true : false);
    const err = { ...errors };
    err[e.target.name] = null;
    setErrors(err);
  };
  const generateNonce = () => {
    // Generate a random number or string that is unique for each request
    // You can use various methods to generate a nonce, such as a timestamp, UUID, or a combination of random characters
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const nonce = `${timestamp}-${randomString}`;

    return nonce;
  };










  const handleSubmit = async (e: FormEvent<NewCourseFormElements>) => {
    e.preventDefault();
    const { send, receive } = e.currentTarget.elements;

    try {
      const elements = formRef.current?.elements as CustomElements;
      const result = await directSchema.validate(
        {
          send: send.value,
          receive: receive.value,
          yourAsset: elements.yourAsset.value,
          partnerAsset: elements.partnerAsset.value,
          visibility: elements.visibility.value,
          tradeType: elements.tradeType.value,
        },
        { abortEarly: false }
      );
      const headers = {
        accept: "*/*",
        Authorization: `Bearer ${accessToken}`,
        // 'Content-Type': 'application/json',
      };

      // const message = {
      //   nonce: generateNonce(),
      //   maker: address,
      //   nftToSell: elements.yourAsset.value,
      //   sellAmount: Number(send.value),
      //   nftToBuyOrTokenAddress: elements.partnerAsset.value,
      //   buyAmount: Number(receive.value),
      // } as const;
      // console.log("nonce", message.nonce);
      // const messageString = JSON.stringify(message);

 //signTyped Data start
  // All properties on a domain are optional
  const domain = {
    name: "OTCDesk",
    version: "1",
    chainId: 11155111,
    verifyingContract: getAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3"),
  };

  // The named list of all type definitions
  const types = {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      // { name: "chainId", type: "string" },
      { name: "verifyingContract", type: "address" },
    ], // Refer to primaryType
    Order: [
      { name: "nonce", type: "uint256" },
      { name: "maker", type: "address" },
      { name: "tokenToSell", type: "address" },
      { name: "sellAmount", type: "uint256" },
      { name: "tokenToBuy", type: "address" },
      { name: "buyAmount", type: "uint256" },
    ],
  } as const;

  const message = {
    nonce: BigInt(1),
    maker: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    tokenToSell: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    sellAmount: BigInt(1000),
    tokenToBuy: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    buyAmount: BigInt(100),
  } as const;

//signTyped Data end


      const signature = await signTypedData({
        // domain,
        domain,
        message,
        primaryType: 'Order',
        types,
      })
      // const signature = await signMessage({ message: `${messageString}` });
      console.log(signature);

      const data = {
        tokenToSell: elements.yourAsset.value,
        sellAmount: Number(send.value),
        tokenToBuy: elements.partnerAsset.value,
        buyAmount: Number(receive.value),
        signature: signature,
        orderType: Number(elements.visibility.value),
      };
      const apiResponse = await axios.post(
        "http://localhost:8000/otc/order/v1/create",
        data,
        { headers }
      );
      console.log("Response:", apiResponse.data);
      setErrors({});
      const resultObj = { ...result };
      console.log(resultObj);
      window.alert("Successfully Created Your Order");
      // setTimeout(() => {
      //   router.push("/allTrade");
      // }, 2000); // 2000 milliseconds = 2 seconds
    } catch (error) {
      console.log(error);
    }
  };

 
  console.log("selectedOption1", selectedOption1);
  return (
    <div className="h-screen">
      <form
        ref={formRef}
        onSubmit={(e: React.FormEvent<NewCourseFormElements>) =>
          handleSubmit(e)
        }
      >
        <div className="flex justify-center w-full text-center gap-6 mb-6">
          <h1 className="mt-4">Trade / Swap</h1>

          <div className="relative">
            <button
              type="button"
              className="text-sm mt-2 z-50 w-full h-[3rem] flex items-center justify-between rounded-2xl  bg-[#004A3D]/50 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {selectedOption ? (
                <span className="block truncate">{selectedOption}</span>
              ) : (
                <span className="block text-gray-400">Select an option</span>
              )}

              <Image
                src="/down.png" // change this later on
                alt="expert-image!"
                width="0"
                height="0"
                sizes="100vw"
                className={`w-[1rem] transform transition-transform duration-200 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            {isOpen && (
              <ul className="absolute z-50 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
                {TradeType.map((option) => (
                  <li
                    key={option.value}
                    className="text-sm cursor-pointer px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() =>
                      handleSelectOption(option.label, option.value)
                    }
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <CardContainer className="mb-4 ">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
            <div className="col-span-1 md:col-span-5 rounded-md">
              {tradeType && (
                <Select
                  name="tradeType"
                  label="Type of Trade"
                  options={[
                    {
                      text: "Select an option",
                      value: "",
                    },
                    ...tradeType.map((item) => ({
                      text: item.label,
                      value: item.value,
                    })),
                  ]}
                  // error={errors.game ?? null}
                  onChange={handleChange}
                />
              )}
            </div>
            <div className="col-span-1 md:col-span-5 rounded-md">
              {visibility && (
                <Select
                  name="visibility"
                  label="Visibility"
                  options={[
                    {
                      text: "Select an option",
                      value: "",
                    },
                    ...visibility.map((item) => ({
                      text: item.label,
                      value: item.value,
                    })),
                  ]}
                  // error={errors.game ?? null}
                  onChange={handleChange}
                />
              )}
            </div>
          </div>
        </CardContainer>
        <CardContainer className="mb-4">
          <InputField
            label="Your Partner's Address"
            name="test"
            placeholder="Enter details..."
            disabled={isDisable}
            // error=""
            // value={formik.values.test}
            // error={formik.errors.test}
            // touched={formik.touched.test}
            // handleChange={formik.handleChange}
          />
        </CardContainer>
        <div className="md:flex">
          <CardContainer balance={24} className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
              <div className="col-span-1 md:col-span-5 rounded-md">
                <InputField
                  label="You Give"
                  name="send"
                  type="number"
                  placeholder="Enter amount you want to trade"
                  // value={formik.values.send}
                  // error={formik.errors.send}
                  // touched={formik.touched.send}
                  // handleChange={formik.handleChange}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-span-1 md:col-span-5 rounded-md">
                {/* <DropdownInput
                  name="yourAsset"
                  label="Your Assets"
                  options={option2}
                /> */}
                {assetType && (
                  <Select
                    name="yourAsset"
                    label="Your Asset"
                    options={[
                      {
                        text: "Select an option",
                        value: "",
                      },
                      ...assetType.map((item) => ({
                        text: item.label,
                        value: item.value,
                      })),
                    ]}
                    // error={errors.game ?? null}
                    onChange={handleChange}
                  />
                )}
              </div>
            </div>
          </CardContainer>
          <button
            type="button"
            className="flex m-3 mx-auto self-center md:items-center"
          >
            <svg
              width="0"
              height="0"
              viewBox="0 0 24 24"
              className="white w-6 h-6 md:w-10 md:h-10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.293 1.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L16 4.414V14a1 1 0 1 1-2 0V4.414l-2.293 2.293a1 1 0 1 1-1.414-1.414l4-4ZM10 10a1 1 0 1 0-2 0v9.586l-2.293-2.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L10 19.586V10Z"
                fill="#ffffff"
              />
            </svg>
          </button>
          <CardContainer className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
              <div className="col-span-1 md:col-span-5 rounded-md">
                <InputField
                  label="You Receive"
                  name="receive"
                  type="number"
                  placeholder="Amount you will receive"
                  // value={formik.values.receive}
                  // error={formik.errors.receive}
                  // touched={formik.touched.receive}
                  handleChange={handleChange}
                />
              </div>
              <div className="col-span-1 md:col-span-5 rounded-md">
                {assetType && (
                  <Select
                    name="partnerAsset"
                    label="Your partner Asset"
                    options={[
                      {
                        text: "Select an option",
                        value: "",
                      },
                      ...assetType.map((item) => ({
                        text: item.label,
                        value: item.value,
                      })),
                    ]}
                    // error={errors.game ?? null}
                    onChange={handleChange}
                  />
                )}
              </div>
            </div>
          </CardContainer>
        </div>
        <div className="w-full flex justify-center">
          <Button
            type="submit"
            className="mt-5 max-w-[25rem] mx-auto"
            text={"Create Trade"}
          />
        </div>
      </form>
    </div>
  );
};

export default DirectTrade;
