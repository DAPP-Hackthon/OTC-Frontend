import React, { FormEvent, useCallback, useRef, useState } from "react";
import { useRouter } from "next/router";
import CardContainer from "../components/cards/cardContainer1";
import { InputField } from "../components/forms/inputField";
import { Button } from "../components/buttons/button";
import Image from "next/image";
import { TradeType, SettlementChain } from "@/sampleData/data";
import { Field, useFormik } from "formik";
import * as Yup from "yup";
import { Select } from "@/components/forms/selectField/select";
import axios from "axios";
import { signMessage, signTypedData } from "@wagmi/core";
import Cookies from "universal-cookie";
import { ethers } from "ethers";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignMessage,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { getAddress } from "viem";
import { RxContainer } from "react-icons/rx";
import { TbLetterB } from "react-icons/tb";

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
  settlementChain: HTMLSelectElement;
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
  // settlementChain: Yup.string().required("Field is required!"),
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
    //router.push(`/tradeType/${value}`);
  };

  const visibility = [
    { value: 0, label: "Private", ref:"0" },
    { value: 1, label: "Public", ref:"1" },
  ];
  const tradeType = [
    { value: "direct", label: "Direct" },
    { value: "fractional", label: "Fractional" },
  ];
  const assetType = [
    { value: "0x8b9c35c79af5319c70dd9a3e3850f368822ed64e", label: "ETH" },
  ];
  const networkType = [{ value: "0x1", label: "Ethereum Mainnet" }];
  const settlementChain = [
    { value: "zetachain", label: "Zeta Chain" },
    { value: "ethereum", label: "Ethereum" },
  ];
  const selectionAllowed: boolean = false;

  const handleChange = async (
    e: React.ChangeEvent<HTMLElement & { name: string }>
  ) => {
    const elements = formRef.current?.elements as CustomElements;
    console.log(elements);
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
      console.log(result);

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
        verifyingContract: getAddress(
          "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        ),
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
        primaryType: "Order",
        types,
      });
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

  const [swapActive, setSwapActive] = useState("Normal Swap");
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  const [modalFundsOpen, setModalFundsOpen] = useState(false);
  const openFundsModal = () => {
    setModalFundsOpen(true);
  };
  const closeFundsModal = () => {
    setModalFundsOpen(false);
  };

  let walletBalance: string = "0";
  const walletAddr = "0xa6f8DF7041640aD737dE9fDEd3b440F4EcbF59c8";

  async function fetchWalletBalance(walletAddress: string): Promise<string> {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        "https://eth.llamarpc.com"
      );
      const balance = await provider.getBalance(walletAddress);
      walletBalance = ethers.utils.formatEther(balance);
      console.log("Wallet Balance:", walletBalance);
      return walletBalance;
    } catch (error) {
      console.error("Error retrieving wallet balance:", error);
      return "0";
    }
  }
  fetchWalletBalance(walletAddr);

  console.log("selectedOption1", selectedOption1);

  return (
    <div className="h-screen">
      <div className="flex">
        <div className="w-1/2 flex justify-left pr-3">
          <Button
            onClick={() => setSwapActive("Normal Swap")}
            type="submit"
            className="mt-5 w-full mx-auto"
            text={"Normal Swap"}
            style={{
              backgroundColor: swapActive === "Normal Swap" ? "" : "#232425",
              color: swapActive === "Normal Swap" ? "#132021" : "#A6A6A6",
            }}
          />
        </div>
        <div className="w-1/2 flex justify-right pl-3 ">
          <Button
            onClick={() => setSwapActive("Cross Chain Swap")}
            type="submit"
            className="mt-5 w-full mx-auto"
            text={"Cross Chain Swap"}
            style={{
              backgroundColor:
                swapActive === "Cross Chain Swap" ? "" : "#232425",
              color: swapActive === "Cross Chain Swap" ? "#132021" : "#A6A6A6",
            }}
          />
        </div>
      </div>
      {swapActive === "Normal Swap" && (
        <form
          ref={formRef}
          onSubmit={(e: React.FormEvent<NewCourseFormElements>) =>
            handleSubmit(e)
          }
        >
          <br />
          <div className=" m-auto grid grid-cols-2 flex-wrap w-full mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="mt-4 mr-80">
                <b>Trade / Swap</b>
              </h1>
              <div className="relative">
                <button
                  type="button"
                  className="text-sm mt-2 z-50 w-full h-[3rem] flex items-center justify-between rounded-2xl  bg-[#004A3D]/50 px-10 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {selectedOption ? (
                    <span className="block truncate">{selectedOption}</span>
                  ) : (
                    <span className="block text-gray-400 mr-4">
                      Select an option
                    </span>
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
                  <ul className="absolute z-50 mt-1 w-1/4 rounded-md shadow-lg">
                    <CardContainer>
                      {TradeType.map((option) => (
                        <li
                          key={option.value}
                          className="text-sm cursor-pointer px-4 py-2 text-white-700 hover:bg-gray-100"
                          onClick={() =>
                            handleSelectOption(option.label, option.value)
                          }
                        >
                          {option.label}
                        </li>
                      ))}
                    </CardContainer>
                  </ul>
                )}
              </div>
            </div>
            <CardContainer className="tile mt-6 row-start-2">
              <div className="grid grid-cols-2 md:grid-cols-10 gap-4 justify-start">
                <div className="col-span-1t md:col-span-5 rounded-md">
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
              <br />
              {isDisable ? (
                ""
              ) : (
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
              )}
            </CardContainer>
            <CardContainer balance={"24"} className="tile row-start-2">
              <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                <div className="col-span-1 md:col-span-10 rounded-md">
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
                <div className="col-span-1 md:col-span-10 rounded-md">
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
              </div>
            </CardContainer>
            <button
              type="button"
              className="m-3 tile row-start-3 col-start-2 mx-auto md:items-center"
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
            <CardContainer className="tile row-start-4 col-start-2">
              <div className="grid grid-cols-2 md:grid-cols-10 gap-4">
                <div className="col-span-1 md:col-span-10 rounded-md">
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
                <div className="col-span-1 md:col-span-10 rounded-md">
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

            <div className="grid w-screen row-start-5 grid-cols-6">
              <Button
                type="submit"
                className="mt-5 mb-8 md:grid-cols-50 sm:w-full md:w-full lg:w-[30rem] xl:w-[30rem] justify-center col-start-4 "
                text={"Create Trade"}
              />
            </div>
          </div>
        </form>
      )}

      {/* Cross Chain Swap */}

      {swapActive === "Cross Chain Swap" && (
        <form
          ref={formRef}
          onSubmit={(e: React.FormEvent<NewCourseFormElements>) =>
            handleSubmit(e)
          }
        >
          <br />
          <div className="m-auto grid grid-cols-2 flex-wrap w-full mx-auto">
            <div className="flex justify-between">
              <h1 className="mt-4 mr-72">
                <b>Cross Chain Swap</b>
              </h1>
              <div className="relative ">
                <button
                  type="button"
                  className="text-sm mt-2 z-50 w-full h-[3rem] flex items-center justify-between rounded-2xl  bg-[#004A3D]/50 px-10 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {selectedOption ? (
                    <span className="block truncate">{selectedOption}</span>
                  ) : (
                    <span className="block text-gray-400 mr-4">
                      Select an option
                    </span>
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
            <CardContainer className="tile mt-4 row-start-2 h-64">
              <div className="grid grid-cols-2 md:grid-cols-10 gap-4 justify-start">
                <div className="col-span-2 md:col-span-10 rounded-md">
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
              <br />
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

            <CardContainer balance={"24"} className="row-start-2 tile">
              <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
                <div className="col-span-1 md:col-span-5 rounded-md">
                  {/* <DropdownInput
                  name="yourAsset"
                  label="Your Assets"
                  options={option2}
                /> */}
                  {networkType && (
                    <Select
                      name="yourNetwork"
                      label="Network"
                      options={[
                        {
                          text: "Select an option",
                          value: "",
                        },
                        ...networkType.map((item) => ({
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
                  {/* <DropdownInput
                  name="yourAsset"
                  label="Your Assets"
                  options={option2}
                /> */}
                  {assetType && (
                    <Select
                      name="yourAsset"
                      label="Token"
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
                <div className="col-span-1 md:col-span-10 rounded-md">
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
                  <InputField
                    label="Balance"
                    name="balance"
                    type="number"
                    placeholder={"0 ETH"}
                    disabled={isDisable}
                  />
                </div>
                <div className="col-span-1 md:col-span-5 rounded-md">
                  <InputField
                    label="Required"
                    name="required"
                    type="number"
                    placeholder="0 ETH"
                    disabled={isDisable}
                  />
                </div>
              </div>
            </CardContainer>
            <button
              type="button"
              className="m-3 row-start-3 tile col-start-2 mx-auto md:items-center"
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
            <CardContainer className="tile row-start-4 col-start-2">
              <div className="grid grid-cols-2 md:grid-cols-10 gap-4">
                <div className="col-span-1 md:col-span-5 rounded-md">
                  {/* <DropdownInput
                  name="yourAsset"
                  label="Your Assets"
                  options={option2}
                /> */}
                  {networkType && (
                    <Select
                      name="yourNetwork"
                      label="Network"
                      options={[
                        {
                          text: "Select an option",
                          value: "",
                        },
                        ...networkType.map((item) => ({
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
                  {/* <DropdownInput
                  name="yourAsset"
                  label="Your Assets"
                  options={option2}
                /> */}
                  {assetType && (
                    <Select
                      name="yourAsset"
                      label="Token"
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
                <div className="col-span-1 md:col-span-10 rounded-md">
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
              </div>
            </CardContainer>

            <CardContainer className="tile row-start-5 mt-4 col-start-2">
              <div className="grid grid-cols-4 md:grid-cols-10 gap-4">
                <div className="col-span-1 md:col-span-8 rounded-md">
                  {settlementChain && (
                    <Select
                      name="settlementChain"
                      label="Settlement Chain"
                      options={[
                        {
                          text: "Select an option",
                          value: "",
                        },
                        ...settlementChain.map((item) => ({
                          text: item.label,
                          value: item.value,
                        })),
                      ]}
                      // error={errors.game ?? null}
                      // onChange={handleChange}
                    />
                  )}
                </div>

                <div className="tile w-100% col-span-2 my-8 md:col-span-2 rounded-md">
                  <Button type="submit" text={"?"} onClick={openModal} />

                  <div className="tile w-100% col-span-2 my-8 md:col-span-2 rounded-md">
                    <Button type="submit" text={"?"} onClick={openFundsModal} />
                  </div>
                </div>
              </div>
            </CardContainer>

            <div className="grid row-start-6 w-screen grid-cols-6">
              <Button
                type="submit"
                className="mt-5 row-start-6 mb-8 md:grid-cols-50 sm:w-full md:w-full lg:w-[30rem] xl:w-[30rem] justify-center col-start-4 ml-[-1rem]"
                text={"Create Trade"}
              />
            </div>

            {modalOpen && (
              <div className="fixed flex inset-0 items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-black bg-opacity-20 absolute inset-0"></div>
                <div className="p-4 rounded-lg shadow-lg border border-gray-300 text-white bg-opacity-80 max-w-[1000px] backdrop-filter backdrop-blur-sm">
                  <div className="grid mt-6 grid-cols-2 items-center justify-content">
                    <svg
                      width="338"
                      height="225"
                      viewBox="0 0 338 225"
                      className="mx-auto col-start-1"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M311.567 136.449L305.663 136.575L302.666 136.624C301.662 136.647 300.654 136.624 299.651 136.651H299.453V136.449L299.426 131.4V131.175H299.651L305.609 131.202C307.598 131.202 309.582 131.251 311.567 131.274H311.693V131.4C311.693 132.255 311.657 133.105 311.634 133.947L311.567 136.449ZM311.567 136.449L311.504 133.906C311.481 133.069 311.454 132.241 311.445 131.413L311.567 131.539C309.582 131.562 307.598 131.611 305.609 131.611L299.651 131.638L299.876 131.413V136.449L299.673 136.251C300.654 136.251 301.635 136.251 302.621 136.273L305.55 136.35L311.567 136.449Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M304.92 142.799L299.016 142.925L296.014 142.974C295.015 142.974 294.007 142.974 293.004 143.001H292.806V142.799V137.763V137.538H293.031L298.989 137.57C300.973 137.57 302.962 137.619 304.947 137.642H305.073V137.763C305.073 138.618 305.037 139.469 305.014 140.31L304.92 142.799ZM304.92 142.799L304.857 140.256C304.834 139.419 304.807 138.591 304.798 137.763L304.92 137.889C302.935 137.912 300.946 137.961 298.962 137.961L293.004 137.988L293.229 137.763V142.799L293.026 142.601C294.007 142.601 294.988 142.601 295.974 142.623L298.93 142.677L304.92 142.799Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M318.213 142.799L312.309 142.925L309.312 142.974C308.309 142.974 307.301 142.974 306.297 143.001H306.099V142.799L306.072 137.763V137.538H306.297L312.255 137.57C314.244 137.57 316.229 137.619 318.213 137.642H318.339V137.763C318.339 138.618 318.299 139.469 318.281 140.31L318.213 142.799ZM318.213 142.799L318.15 140.256C318.15 139.419 318.101 138.591 318.092 137.763L318.213 137.889C316.229 137.912 314.244 137.961 312.255 137.961L306.297 137.988L306.522 137.763V142.799L306.32 142.601C307.305 142.601 308.282 142.601 309.267 142.623L312.228 142.677L318.213 142.799Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M141.656 76.5315L135.752 76.6575L132.755 76.707C131.751 76.707 130.743 76.707 129.74 76.707H129.542V76.5045L129.515 71.469V71.244H129.74L135.698 71.271C137.687 71.271 139.671 71.3205 141.656 71.343H141.782V71.4645C141.782 72.3195 141.741 73.1655 141.719 74.007L141.656 76.5315ZM141.656 76.5315L141.593 73.9845C141.593 73.1475 141.543 72.3195 141.534 71.496L141.656 71.6175C139.671 71.6175 137.687 71.6895 135.698 71.6895L129.74 71.721L129.965 71.496L129.942 76.5315L129.74 76.329C130.721 76.329 131.702 76.329 132.687 76.356L135.648 76.4055L141.656 76.5315Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M135 82.881L129.096 83.007L126.094 83.0565C125.095 83.0565 124.087 83.0565 123.084 83.079H122.886V82.8765L122.85 77.85V77.625H123.075L129.033 77.652C131.017 77.652 133.006 77.7015 134.991 77.724H135.117V77.85C135.117 78.705 135.081 79.551 135.058 80.3925L135 82.881ZM135 82.881L134.937 80.334C134.914 79.497 134.887 78.669 134.878 77.8455L135 77.967C133.015 77.9895 131.026 78.039 129.042 78.039L123.084 78.0705L123.309 77.8455L123.3 82.881L123.097 82.6785C124.078 82.6785 125.059 82.6785 126.045 82.7055L129.001 82.755L135 82.881Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M148.302 82.881L142.398 83.007L139.401 83.0565C138.398 83.0565 137.394 83.0565 136.386 83.079H136.188V82.8765L136.161 77.85V77.625H136.386L142.344 77.652C144.333 77.652 146.318 77.7015 148.302 77.724H148.428V77.85C148.428 78.705 148.388 79.551 148.37 80.3925L148.302 82.881ZM148.302 82.881L148.239 80.334C148.239 79.497 148.19 78.669 148.181 77.8455L148.302 77.967C146.318 77.9895 144.333 78.039 142.344 78.039L136.386 78.0705L136.611 77.8455L136.589 82.881L136.386 82.6785C137.372 82.6785 138.348 82.6785 139.334 82.7055L142.295 82.755L148.302 82.881Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M44.496 109.85L38.592 109.976L35.5905 110.025C34.5915 110.025 33.5835 110.025 32.58 110.048H32.4V109.845V104.81V104.585H32.625L38.583 104.612C40.5675 104.612 42.5565 104.661 44.541 104.684H44.667V104.805C44.667 105.66 44.631 106.506 44.6085 107.348L44.496 109.85ZM44.496 109.85L44.433 107.302C44.433 106.465 44.3835 105.638 44.3745 104.814L44.496 104.936C42.5115 104.958 40.5225 105.008 38.538 105.008L32.58 105.039L32.805 104.814L32.7825 109.85L32.58 109.647C33.561 109.647 34.542 109.647 35.5275 109.674L38.484 109.724L44.496 109.85Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M242.037 76.527L236.133 76.653L233.136 76.7025C232.133 76.725 231.124 76.7025 230.121 76.725H229.923V76.5225L229.896 71.487V71.262H230.121L236.079 71.289C238.068 71.289 240.052 71.343 242.037 71.3655H242.163V71.487C242.163 72.342 242.127 73.1925 242.104 74.0295L242.037 76.527ZM242.037 76.527L241.974 73.9845C241.951 73.143 241.925 72.315 241.916 71.4915L242.037 71.613C240.052 71.6355 238.068 71.685 236.079 71.6895L230.121 71.7165L230.346 71.4915L230.323 76.527L230.121 76.3245C231.102 76.3245 232.083 76.3245 233.068 76.3515L236.029 76.401L242.037 76.527Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M310.878 27.621L304.974 27.747L301.972 27.7965C300.973 27.7965 299.965 27.7965 298.962 27.8235H298.764V27.621V22.5855V22.3605H298.989L304.947 22.3875C306.931 22.3875 308.92 22.4415 310.905 22.464H311.031V22.5855C311.031 23.4405 310.995 24.291 310.972 25.128L310.878 27.621ZM310.878 27.621L310.815 25.0785C310.792 24.237 310.765 23.409 310.756 22.5855L310.878 22.707C308.893 22.707 306.904 22.779 304.92 22.7835L298.962 22.8105L299.187 22.5855L299.164 27.621L298.962 27.4185C299.943 27.4185 300.924 27.4185 301.909 27.4455L304.866 27.495L310.878 27.621Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M317.525 33.9705L311.621 34.0965L308.624 34.146C307.62 34.1685 306.612 34.146 305.609 34.1685H305.411V33.966L305.384 28.9305V28.7055H305.609L311.567 28.7325C313.556 28.7325 315.54 28.7865 317.525 28.809H317.651V28.9305C317.651 29.7855 317.61 30.636 317.588 31.473L317.525 33.9705ZM317.525 33.9705L317.462 31.428C317.462 30.5865 317.412 29.7585 317.403 28.935L317.525 29.0565C315.54 29.079 313.556 29.1285 311.567 29.133L305.609 29.16L305.834 28.935V33.9705L305.631 33.768C306.612 33.768 307.593 33.768 308.579 33.795L311.54 33.8445L317.525 33.9705Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M31.203 27.6255L25.2945 27.7515L22.2975 27.801C21.2985 27.801 20.2905 27.801 19.287 27.828H19.0845V27.6255V22.59V22.365H19.314L25.272 22.3965C27.2565 22.3965 29.241 22.446 31.23 22.4685H31.3515V22.59C31.3515 23.445 31.311 24.2955 31.293 25.137L31.203 27.6255ZM31.203 27.6255L31.1355 25.083C31.1355 24.2415 31.086 23.4135 31.077 22.59L31.203 22.7115C29.214 22.7385 27.2295 22.7835 25.245 22.788L19.287 22.815L19.512 22.59L19.485 27.6255L19.287 27.45C20.268 27.45 21.2445 27.45 22.23 27.45L25.191 27.4995L31.203 27.6255Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M56.1464 64.575C57.1078 67.6649 57.1319 70.9703 56.2156 74.0739C55.2994 77.1775 53.4839 79.9399 50.9985 82.0122C48.5132 84.0845 45.4694 85.3738 42.2517 85.7171C39.034 86.0605 35.7867 85.4426 32.92 83.9414C30.0533 82.4402 27.6958 80.1231 26.1452 77.2828C24.5947 74.4424 23.9207 71.2063 24.2084 67.9832C24.4961 64.76 25.7325 61.6944 27.7616 59.1735C29.7906 56.6527 32.5212 54.7898 35.6084 53.82C37.6631 53.1752 39.8248 52.942 41.9697 53.1337C44.1146 53.3255 46.2006 53.9384 48.1083 54.9374C50.016 55.9364 51.7079 57.3019 53.0872 58.9556C54.4665 60.6094 55.5061 62.5189 56.1464 64.575Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M45.0854 83.9385C42.2157 84.8431 39.142 84.8757 36.2537 84.0321C33.3655 83.1886 30.7925 81.5068 28.8607 79.1999C26.929 76.8929 25.7253 74.0646 25.4022 71.073C25.0791 68.0815 25.6511 65.0613 27.0458 62.3951C28.4404 59.7289 30.5949 57.5365 33.2365 56.0957C35.8781 54.6549 38.8878 54.0305 41.8845 54.3015C44.8812 54.5725 47.7301 55.7268 50.0703 57.6181C52.4105 59.5095 54.1368 62.0528 55.0304 64.926C56.2273 68.766 55.8525 72.924 53.9882 76.4881C52.1239 80.0522 48.9223 82.7315 45.0854 83.9385ZM53.6354 65.6235C52.8836 63.0383 51.3837 60.7333 49.3247 58.9988C47.2656 57.2642 44.7394 56.1775 42.0641 55.8757C39.3888 55.5738 36.684 56.0701 34.2902 57.3022C31.8964 58.5343 29.9206 60.4471 28.6115 62.7997C27.3025 65.1523 26.7188 67.8397 26.9338 70.5233C27.1488 73.207 28.153 75.7671 29.82 77.8813C31.4869 79.9955 33.742 81.5692 36.3015 82.4045C38.861 83.2397 41.6103 83.299 44.2034 82.575C45.938 82.0858 47.5587 81.2582 48.972 80.1398C50.3852 79.0214 51.5631 77.6343 52.4378 76.0585C53.3125 74.4827 53.8667 72.7494 54.0684 70.9584C54.27 69.1675 54.1153 67.3543 53.6129 65.6235H53.6354Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M37.575 60.3225L39.0645 59.85L39.1995 60.3C39.384 60.8805 39.5775 61.461 39.7485 62.046C39.8115 62.262 39.906 62.289 40.122 62.2575C40.7641 62.1278 41.4158 62.0511 42.0705 62.028C43.7445 62.028 44.838 62.9595 45.2205 64.593C45.2924 64.8895 45.3465 65.19 45.3825 65.493C45.4205 65.8625 45.3719 66.2359 45.2407 66.5834C45.1095 66.931 44.8992 67.2432 44.6265 67.4955C44.5005 67.626 44.3655 67.752 44.208 67.905C44.487 67.932 44.7345 67.941 44.9775 67.977C45.6164 68.0478 46.2201 68.3061 46.7125 68.7193C47.205 69.1324 47.5642 69.6821 47.745 70.299C47.9752 70.8953 48.0823 71.5321 48.06 72.171C48.0391 72.5941 47.9331 73.0086 47.7483 73.3898C47.5635 73.771 47.3037 74.111 46.9845 74.3895C46.2303 75.0307 45.3572 75.5169 44.415 75.8205C44.1945 75.9015 44.127 75.978 44.208 76.212C44.4015 76.7835 44.559 77.364 44.739 77.9355C44.784 78.075 44.7705 78.1695 44.622 78.2145L43.344 78.6195L43.173 78.0795C43.02 77.598 42.8625 77.112 42.723 76.626C42.6735 76.4595 42.606 76.401 42.426 76.464C42.1515 76.563 41.868 76.644 41.562 76.7385C41.796 77.49 42.012 78.21 42.255 78.9435L40.761 79.416C40.527 78.6825 40.311 77.967 40.0635 77.2155L36.36 78.3855C36.0945 77.535 35.838 76.7205 35.568 75.8745L36.6615 75.528C35.7615 72.648 34.8615 69.7995 33.9615 66.924L32.877 67.266C32.6115 66.429 32.355 65.6145 32.085 64.7685L35.7705 63.603L35.001 61.164L36.486 60.714C36.7335 61.506 36.9855 62.298 37.2465 63.117L38.3445 62.7705C38.0835 61.9335 37.8315 61.1415 37.575 60.3225ZM40.5675 70.5105C40.32 70.587 40.077 70.6725 39.8295 70.74C39.663 70.785 39.6315 70.8615 39.681 71.0235C39.999 72.0135 40.3125 73.0065 40.6215 74.0025C40.6845 74.196 40.7745 74.2185 40.9455 74.16C41.3955 74.016 41.8095 73.89 42.237 73.746C42.6327 73.6349 42.9726 73.3799 43.1899 73.031C43.4072 72.6822 43.4863 72.2646 43.4115 71.8605C43.3992 71.5881 43.322 71.3227 43.1862 71.0862C43.0505 70.8498 42.8602 70.6492 42.6312 70.5012C42.4023 70.3533 42.1412 70.2622 41.8699 70.2356C41.5986 70.2091 41.3248 70.2478 41.0715 70.3485L40.5675 70.5105ZM38.466 67.1535C38.5965 67.5765 38.736 67.9995 38.862 68.4225C38.907 68.5665 38.97 68.625 39.123 68.571C39.573 68.418 40.023 68.2875 40.473 68.121C40.6983 68.0419 40.889 67.8868 41.0122 67.6822C41.1354 67.4777 41.1834 67.2366 41.148 67.0005C41.1132 66.6792 41.0345 66.3643 40.914 66.0645C40.8545 65.9032 40.7635 65.7554 40.6464 65.6296C40.5293 65.5039 40.3883 65.4026 40.2317 65.3319C40.0751 65.2611 39.9059 65.2222 39.7341 65.2174C39.5623 65.2126 39.3913 65.242 39.231 65.304C38.8935 65.4075 38.565 65.52 38.2275 65.6145C38.061 65.664 38.0295 65.7405 38.079 65.898C38.2005 66.3075 38.331 66.735 38.466 67.1535Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M46.8 57.339C48.4146 58.1357 49.8541 59.2464 51.0345 60.606C52.2123 61.9793 53.1083 63.5711 53.6714 65.2905C54.2412 67.0161 54.4555 68.8393 54.3014 70.65C54.1513 72.4635 53.6405 74.2288 52.799 75.8423C51.9575 77.4558 50.8022 78.885 49.401 80.046C48.0072 81.2118 46.3924 82.0842 44.6535 82.611C42.9214 83.134 41.1034 83.3114 39.3029 83.133C37.5119 82.9456 35.7767 82.4009 34.2 81.531C36.5956 82.7221 39.2874 83.1864 41.9436 82.8665C44.5999 82.5467 47.1045 81.4567 49.149 79.731C51.8609 77.4203 53.5696 74.1467 53.9144 70.6005C54.1456 67.9378 53.5957 65.2654 52.3322 62.9102C51.0687 60.555 49.1462 58.619 46.8 57.339Z"
                        fill="white"
                      />
                      <path
                        d="M34.1054 81.54C32.4922 80.7393 31.0555 79.6239 29.8799 78.2595C28.706 76.8823 27.8146 75.2875 27.2564 73.566C26.6986 71.8363 26.4951 70.012 26.6579 68.202C26.8121 66.3891 27.3274 64.6255 28.1737 63.0149C29.0199 61.4043 30.18 59.9793 31.5854 58.824C32.9803 57.6604 34.597 56.7924 36.3374 56.2725C38.0719 55.754 39.8914 55.5812 41.6924 55.764C43.4824 55.9611 45.2155 56.5117 46.7909 57.384C44.4001 56.1857 41.7114 55.7117 39.0549 56.0203C36.3984 56.3289 33.8899 57.4066 31.8374 59.121C29.1173 61.4229 27.3988 64.6922 27.0449 68.238C26.7989 70.9019 27.336 73.5796 28.5902 75.9426C29.8444 78.3056 31.7613 80.251 34.1054 81.54Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M32.85 67.2435C32.769 67.041 32.6925 66.834 32.6205 66.627C32.5485 66.42 32.4675 66.2175 32.4 66.0105L31.95 64.773L31.9185 64.6875L32.0085 64.656C33.2325 64.245 34.461 63.858 35.694 63.495L35.6355 63.6075L35.2845 62.379L35.1135 61.758L34.9515 61.1415C35.028 61.3395 35.1045 61.542 35.1765 61.74L35.3925 62.343L35.811 63.5535L35.838 63.639L35.748 63.666C34.527 64.074 33.2985 64.4625 32.0625 64.8315L32.1255 64.7145L32.4855 65.9745C32.5485 66.186 32.6025 66.3975 32.661 66.609C32.7195 66.8205 32.814 67.05 32.85 67.2435Z"
                        fill="white"
                      />
                      <path
                        d="M36.3645 78.363C36.216 77.949 36.072 77.535 35.9145 77.121C35.757 76.707 35.631 76.2885 35.4915 75.8745L35.469 75.807L35.5365 75.7845L36.6255 75.42L36.567 75.5325L35.874 73.386C35.6445 72.6705 35.424 71.9505 35.2035 71.2305C34.983 70.5105 34.7535 69.795 34.5555 69.0705C34.3575 68.346 34.137 67.626 33.939 66.9015C34.191 67.608 34.443 68.319 34.6815 69.0345C34.92 69.75 35.1585 70.4565 35.388 71.1765C35.6175 71.8965 35.838 72.603 36.0765 73.323L36.7425 75.4785L36.7695 75.5685L36.684 75.5955L35.5815 75.9195L35.6265 75.8295C35.7525 76.2525 35.883 76.671 35.9955 77.094C36.108 77.517 36.252 77.9355 36.3645 78.363Z"
                        fill="white"
                      />
                      <path
                        d="M40.95 74.16C41.184 74.061 41.4 73.98 41.6475 73.8855L42.354 73.6335C42.5679 73.5417 42.7592 73.4043 42.9146 73.231C43.0701 73.0577 43.1859 72.8526 43.254 72.63C43.3842 72.1708 43.3376 71.6795 43.1235 71.253C43.0243 71.0322 42.8803 70.8345 42.7005 70.6725C42.5239 70.5001 42.312 70.368 42.0795 70.2855C42.333 70.3364 42.5719 70.4438 42.7783 70.5996C42.9847 70.7554 43.1534 70.9556 43.272 71.1855C43.4046 71.4131 43.4898 71.6652 43.5223 71.9266C43.5548 72.1881 43.5339 72.4534 43.461 72.7065C43.3838 72.9602 43.2472 73.1917 43.0624 73.3819C42.8777 73.5721 42.6502 73.7154 42.399 73.8C41.9175 73.9215 41.436 74.052 40.95 74.16Z"
                        fill="white"
                      />
                      <path
                        d="M39.1769 68.553C39.5549 68.3865 39.9464 68.238 40.3199 68.103C40.4919 68.0145 40.6409 67.8871 40.755 67.7308C40.869 67.5746 40.945 67.3938 40.9769 67.203C41.0385 66.816 40.9722 66.4194 40.7879 66.0735C40.61 65.7086 40.3261 65.4059 39.9734 65.205C40.3878 65.3427 40.7359 65.6299 40.9499 66.0105C41.1838 66.3827 41.2735 66.8277 41.2019 67.2615C41.1631 67.4814 41.0694 67.6879 40.9293 67.8618C40.7893 68.0357 40.6075 68.1713 40.4009 68.256C39.9779 68.4 39.5999 68.4675 39.1769 68.553Z"
                        fill="white"
                      />
                      <path
                        d="M40.0499 77.193C40.416 77.8773 40.6524 78.6233 40.7474 79.3935C40.5595 79.0552 40.4086 78.6977 40.2974 78.327C40.1763 77.9585 40.0934 77.5785 40.0499 77.193Z"
                        fill="white"
                      />
                      <path
                        d="M42.6014 76.4235C42.7875 76.7627 42.9383 77.12 43.0514 77.49C43.1715 77.8555 43.253 78.2325 43.2944 78.615C43.1057 78.2787 42.9548 77.9225 42.8444 77.553C42.7243 77.186 42.6429 76.8074 42.6014 76.4235Z"
                        fill="white"
                      />
                      <path
                        d="M313.326 115.425C313.106 118.654 311.935 121.745 309.96 124.308C307.985 126.871 305.294 128.791 302.228 129.826C299.162 130.861 295.858 130.964 292.734 130.122C289.609 129.28 286.804 127.531 284.673 125.096C282.542 122.661 281.18 119.649 280.76 116.441C280.34 113.232 280.88 109.971 282.312 107.069C283.745 104.168 286.005 101.755 288.807 100.137C291.609 98.5193 294.828 97.768 298.057 97.9785C300.206 98.1192 302.306 98.6823 304.237 99.6357C306.168 100.589 307.892 101.914 309.311 103.535C310.729 105.155 311.814 107.04 312.503 109.08C313.192 111.12 313.471 113.276 313.326 115.425Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M296.019 129.488C293.015 129.295 290.136 128.216 287.746 126.386C285.356 124.556 283.563 122.057 282.594 119.207C281.625 116.358 281.524 113.284 282.303 110.377C283.082 107.469 284.707 104.858 286.971 102.875C289.236 100.892 292.038 99.625 295.022 99.2354C298.007 98.8459 301.04 99.351 303.738 100.687C306.435 102.022 308.676 104.129 310.175 106.739C311.675 109.349 312.365 112.345 312.16 115.348C311.89 119.362 310.039 123.105 307.013 125.755C303.987 128.406 300.033 129.748 296.019 129.488ZM310.585 115.488C310.817 112.805 310.249 110.114 308.953 107.753C307.657 105.392 305.692 103.467 303.305 102.221C300.917 100.975 298.215 100.464 295.537 100.751C292.859 101.038 290.327 102.111 288.258 103.835C286.189 105.559 284.676 107.856 283.911 110.438C283.145 113.02 283.161 115.771 283.956 118.344C284.75 120.917 286.289 123.197 288.377 124.897C290.465 126.598 293.01 127.642 295.69 127.899C297.485 128.07 299.295 127.883 301.017 127.351C302.739 126.818 304.339 125.95 305.723 124.796C307.108 123.643 308.251 122.226 309.085 120.628C309.92 119.031 310.43 117.284 310.585 115.488Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M297.54 104.751L299.101 104.85C299.101 105.012 299.101 105.156 299.074 105.3C299.034 105.912 299.007 106.52 298.953 107.127C298.953 107.352 299.011 107.411 299.227 107.46C299.873 107.57 300.508 107.734 301.126 107.951C302.683 108.567 303.376 109.818 303.147 111.483C303.106 111.786 303.049 112.086 302.976 112.383C302.877 112.741 302.696 113.071 302.447 113.347C302.199 113.624 301.89 113.839 301.545 113.976C301.378 114.053 301.207 114.12 301.009 114.205C301.257 114.331 301.482 114.431 301.698 114.552C302.265 114.849 302.733 115.305 303.043 115.865C303.354 116.425 303.493 117.064 303.444 117.702C303.441 118.341 303.311 118.973 303.061 119.561C302.89 119.948 302.642 120.296 302.333 120.585C302.024 120.874 301.659 121.098 301.261 121.243C300.327 121.568 299.338 121.706 298.35 121.648C298.116 121.648 298.026 121.689 298.017 121.941C297.99 122.54 297.927 123.138 297.891 123.741C297.891 123.89 297.837 123.971 297.679 123.962L296.329 123.876C296.329 123.674 296.352 123.494 296.365 123.314C296.397 122.805 296.424 122.296 296.464 121.792C296.464 121.617 296.437 121.536 296.248 121.532C295.956 121.532 295.663 121.5 295.348 121.478C295.299 122.265 295.249 123.016 295.2 123.786L293.634 123.687C293.683 122.917 293.733 122.166 293.782 121.379L289.908 121.131C289.962 120.231 290.016 119.394 290.074 118.508L291.217 118.58C291.411 115.565 291.6 112.585 291.793 109.579L290.659 109.508C290.713 108.63 290.767 107.779 290.826 106.893L294.682 107.136C294.736 106.268 294.79 105.435 294.844 104.585L296.397 104.684C296.343 105.512 296.293 106.344 296.235 107.199L297.387 107.276C297.45 106.439 297.486 105.611 297.54 104.751ZM296.64 115.335C296.379 115.335 296.122 115.308 295.866 115.281C295.695 115.281 295.636 115.326 295.627 115.492C295.564 116.532 295.501 117.571 295.429 118.611C295.429 118.813 295.492 118.868 295.672 118.877C296.122 118.877 296.572 118.935 297.022 118.953C297.434 118.992 297.845 118.875 298.175 118.625C298.504 118.375 298.727 118.01 298.8 117.603C298.885 117.344 298.907 117.069 298.865 116.8C298.822 116.531 298.717 116.276 298.556 116.057C298.396 115.837 298.185 115.658 297.942 115.536C297.699 115.413 297.43 115.351 297.157 115.353L296.64 115.335ZM295.888 111.447C295.857 111.897 295.834 112.347 295.798 112.77C295.798 112.919 295.83 112.999 295.987 113.004C296.46 113.004 296.928 113.063 297.4 113.058C297.639 113.065 297.871 112.989 298.06 112.842C298.248 112.696 298.379 112.489 298.431 112.257C298.514 111.944 298.555 111.622 298.552 111.299C298.555 111.127 298.523 110.956 298.459 110.796C298.395 110.637 298.3 110.491 298.18 110.369C298.059 110.246 297.915 110.149 297.757 110.082C297.599 110.015 297.428 109.981 297.256 109.98C296.905 109.953 296.554 109.944 296.208 109.908C296.037 109.908 295.978 109.953 295.969 110.12C295.965 110.561 295.933 111.002 295.906 111.447H295.888Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M307.237 105.3C308.456 106.624 309.397 108.178 310.005 109.872C310.609 111.58 310.87 113.391 310.774 115.2C310.679 117.013 310.22 118.788 309.424 120.42C308.631 122.057 307.517 123.519 306.15 124.72C304.783 125.921 303.19 126.837 301.464 127.413C299.743 127.997 297.922 128.228 296.109 128.093C294.304 127.957 292.544 127.466 290.929 126.648C289.323 125.823 287.899 124.685 286.74 123.3C288.542 125.277 290.883 126.684 293.474 127.347C296.065 128.011 298.794 127.902 301.324 127.035C304.685 125.857 307.458 123.421 309.06 120.24C310.25 117.845 310.713 115.154 310.393 112.499C310.073 109.844 308.984 107.34 307.26 105.296L307.237 105.3Z"
                        fill="white"
                      />
                      <path
                        d="M286.65 123.3C285.435 121.972 284.499 120.415 283.896 118.719C283.295 117.013 283.038 115.206 283.14 113.4C283.242 111.585 283.71 109.809 284.517 108.18C285.313 106.541 286.429 105.078 287.801 103.877C289.172 102.677 290.77 101.764 292.5 101.192C294.222 100.611 296.044 100.386 297.855 100.53C299.66 100.67 301.419 101.167 303.03 101.993C304.629 102.818 306.046 103.957 307.197 105.341C305.4 103.359 303.064 101.946 300.476 101.275C297.887 100.603 295.159 100.703 292.626 101.561C289.252 102.721 286.463 105.15 284.85 108.333C283.657 110.731 283.191 113.426 283.511 116.086C283.831 118.745 284.922 121.253 286.65 123.3Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M290.655 109.508C290.655 109.287 290.655 109.058 290.655 108.851C290.655 108.644 290.655 108.401 290.655 108.194L290.704 106.884V106.794H290.799C292.086 106.857 293.371 106.94 294.655 107.042L294.561 107.127L294.673 105.854L294.741 105.215C294.763 105.003 294.786 104.792 294.813 104.58C294.813 104.792 294.813 105.03 294.813 105.219V105.858L294.763 107.136V107.226H294.673C293.386 107.169 292.099 107.088 290.812 106.983L290.911 106.898L290.794 108.203C290.794 108.419 290.749 108.653 290.727 108.855C290.704 109.058 290.7 109.287 290.655 109.508Z"
                        fill="white"
                      />
                      <path
                        d="M289.903 121.136C289.903 120.686 289.903 120.263 289.944 119.822C289.984 119.381 289.98 118.944 289.998 118.508V118.436H290.07L291.217 118.49L291.118 118.575L291.249 116.325C291.289 115.574 291.352 114.827 291.402 114.075C291.451 113.324 291.514 112.577 291.577 111.825C291.64 111.074 291.708 110.327 291.784 109.575C291.784 110.327 291.744 111.078 291.708 111.825C291.672 112.572 291.64 113.328 291.595 114.075C291.55 114.822 291.51 115.578 291.46 116.325L291.303 118.575V118.67H291.213L290.07 118.58L290.146 118.512C290.106 118.962 290.079 119.385 290.034 119.822C289.989 120.258 289.948 120.704 289.903 121.136Z"
                        fill="white"
                      />
                      <path
                        d="M295.69 118.877C295.942 118.877 296.19 118.877 296.442 118.877H297.189C297.424 118.872 297.655 118.816 297.866 118.712C298.077 118.607 298.262 118.458 298.408 118.274C298.702 117.888 298.836 117.405 298.782 116.924C298.768 116.679 298.706 116.44 298.599 116.22C298.493 116 298.344 115.803 298.161 115.641C298.377 115.781 298.56 115.966 298.696 116.185C298.832 116.404 298.919 116.65 298.948 116.906C298.991 117.165 298.98 117.431 298.916 117.687C298.851 117.942 298.735 118.182 298.575 118.391C298.409 118.599 298.196 118.765 297.954 118.874C297.711 118.984 297.446 119.034 297.18 119.021C296.68 119.003 296.185 118.953 295.69 118.877Z"
                        fill="white"
                      />
                      <path
                        d="M296.064 113.009C296.473 113.009 296.896 113.009 297.297 113.009C297.486 112.99 297.668 112.927 297.828 112.827C297.989 112.726 298.125 112.59 298.224 112.428C298.422 112.09 298.504 111.697 298.458 111.308C298.424 110.903 298.267 110.518 298.008 110.205C298.336 110.479 298.552 110.863 298.615 111.285C298.699 111.716 298.622 112.162 298.399 112.541C298.282 112.73 298.12 112.888 297.926 112.999C297.733 113.111 297.515 113.173 297.292 113.18C296.874 113.135 296.478 113.072 296.064 113.009Z"
                        fill="white"
                      />
                      <path
                        d="M293.778 121.383C293.83 121.768 293.842 122.157 293.814 122.544C293.795 122.932 293.733 123.317 293.629 123.691C293.538 122.919 293.588 122.137 293.778 121.383Z"
                        fill="white"
                      />
                      <path
                        d="M296.415 121.586C296.47 121.967 296.482 122.353 296.451 122.738C296.431 123.122 296.371 123.504 296.271 123.876C296.219 123.494 296.207 123.108 296.235 122.724C296.257 122.339 296.317 121.958 296.415 121.586Z"
                        fill="white"
                      />
                      <path
                        d="M239.143 45.8235C238.44 48.9821 236.816 51.8613 234.477 54.0976C232.139 56.3339 229.189 57.8268 226.002 58.3879C222.815 58.9489 219.534 58.5529 216.572 57.2499C213.61 55.9468 211.1 53.7952 209.361 51.0667C207.621 48.3383 206.728 45.1554 206.797 41.9202C206.865 38.685 207.89 35.5425 209.743 32.8897C211.596 30.2369 214.194 28.1928 217.208 27.0156C220.222 25.8383 223.518 25.5808 226.679 26.2755C228.781 26.7389 230.772 27.6125 232.537 28.8461C234.302 30.0797 235.807 31.6493 236.964 33.4649C238.122 35.2805 238.91 37.3066 239.284 39.4272C239.658 41.5479 239.61 43.7214 239.143 45.8235Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M219.91 57.114C216.971 56.4701 214.289 54.9685 212.204 52.7994C210.119 50.6302 208.725 47.891 208.198 44.9288C207.67 41.9665 208.034 38.9144 209.243 36.159C210.451 33.4037 212.45 31.0689 214.987 29.4505C217.523 27.8321 220.483 27.0028 223.491 27.0677C226.499 27.1326 229.42 28.0887 231.885 29.8149C234.349 31.5412 236.246 33.96 237.334 36.7649C238.423 39.5698 238.655 42.6347 238 45.5715C237.128 49.4985 234.733 52.9191 231.342 55.0829C227.951 57.2468 223.84 57.9772 219.91 57.114ZM236.421 45.4725C237.055 42.8549 236.899 40.1083 235.975 37.5787C235.05 35.0491 233.398 32.8498 231.225 31.2578C229.053 29.6657 226.458 28.7522 223.767 28.6323C221.077 28.5123 218.411 29.1914 216.106 30.5838C213.8 31.9763 211.959 34.0199 210.813 36.4571C209.667 38.8944 209.268 41.6163 209.666 44.2799C210.064 46.9436 211.242 49.4298 213.05 51.4254C214.859 53.4209 217.218 54.8366 219.829 55.494C221.577 55.9333 223.395 56.0221 225.177 55.7554C226.959 55.4887 228.671 54.8717 230.213 53.94C231.756 53.0083 233.098 51.7804 234.164 50.3271C235.229 48.8738 235.996 47.2238 236.421 45.4725Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M225.149 32.8905L226.679 33.228L226.58 33.678C226.449 34.2765 226.328 34.875 226.184 35.478C226.134 35.6985 226.184 35.7705 226.409 35.8515C227.029 36.0576 227.631 36.3149 228.209 36.621C229.653 37.467 230.148 38.808 229.671 40.4145C229.589 40.7085 229.488 40.9971 229.37 41.2785C229.215 41.6154 228.986 41.9124 228.699 42.1465C228.412 42.3805 228.075 42.5455 227.714 42.6285L227.151 42.777C227.376 42.9345 227.601 43.065 227.777 43.227C228.296 43.6062 228.693 44.1306 228.915 44.7343C229.138 45.338 229.177 45.9941 229.028 46.62C228.93 47.2576 228.706 47.8694 228.371 48.42C228.141 48.7767 227.842 49.0833 227.49 49.3215C227.139 49.5596 226.744 49.7244 226.328 49.806C225.355 49.9876 224.357 49.9754 223.389 49.77C223.16 49.7295 223.061 49.77 223.016 50.0085C222.899 50.598 222.746 51.1785 222.62 51.7635C222.588 51.9075 222.53 51.984 222.377 51.948L221.067 51.6645C221.112 51.4665 221.148 51.291 221.189 51.111C221.297 50.616 221.4 50.1165 221.517 49.6215C221.558 49.455 221.517 49.3695 221.342 49.3335C221.054 49.284 220.766 49.212 220.442 49.1445C220.275 49.914 220.113 50.6475 219.951 51.3945L218.417 51.057C218.583 50.31 218.741 49.572 218.912 48.807L215.114 47.979C215.307 47.1105 215.487 46.2735 215.676 45.405L216.797 45.6525C217.445 42.7005 218.079 39.8025 218.723 36.837L217.611 36.594L218.174 34.0335L221.949 34.857C222.134 34.0065 222.314 33.192 222.494 32.3595L224.015 32.688C223.835 33.5025 223.659 34.317 223.475 35.154L224.6 35.4015L225.149 32.8905ZM222.678 43.2405C222.426 43.1865 222.17 43.137 221.922 43.074C221.756 43.029 221.688 43.074 221.652 43.245C221.436 44.262 221.202 45.2835 220.986 46.3005C220.941 46.494 221.009 46.5615 221.189 46.5975C221.639 46.683 222.089 46.791 222.539 46.881C222.937 46.9816 223.359 46.9294 223.722 46.7345C224.084 46.5396 224.36 46.2163 224.496 45.828C224.62 45.5852 224.684 45.3164 224.683 45.0439C224.682 44.7714 224.616 44.503 224.491 44.2611C224.365 44.0191 224.184 43.8105 223.962 43.6526C223.74 43.4947 223.483 43.392 223.214 43.353L222.678 43.2405ZM222.521 39.285C222.426 39.735 222.336 40.149 222.233 40.581C222.201 40.7295 222.233 40.8105 222.386 40.8375C222.836 40.9275 223.308 41.04 223.772 41.1075C224.007 41.15 224.249 41.1094 224.458 40.9929C224.666 40.8763 224.828 40.691 224.915 40.4685C225.044 40.1729 225.131 39.861 225.176 39.5415C225.204 39.372 225.199 39.1985 225.16 39.0311C225.122 38.8636 225.05 38.7055 224.949 38.5661C224.849 38.4266 224.722 38.3086 224.575 38.2188C224.428 38.129 224.265 38.0692 224.096 38.043C223.754 37.9665 223.407 37.899 223.07 37.8135C222.903 37.773 222.836 37.8135 222.804 37.9845C222.714 38.3985 222.615 38.8305 222.521 39.2625V39.285Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M234.648 34.902C235.653 36.3992 236.349 38.0821 236.695 39.852C237.036 41.6298 237.021 43.4576 236.651 45.2295C236.281 47.0064 235.555 48.6902 234.518 50.1795C233.485 51.6775 232.164 52.9545 230.631 53.9358C229.099 54.9171 227.387 55.583 225.594 55.8945C223.803 56.2114 221.966 56.164 220.194 55.755C218.429 55.3488 216.762 54.5979 215.289 53.5455C213.832 52.4888 212.599 51.1535 211.662 49.617C213.145 51.843 215.247 53.5866 217.709 54.6332C220.171 55.6798 222.885 55.9837 225.517 55.5075C229.023 54.8522 232.136 52.8592 234.198 49.95C235.731 47.7577 236.591 45.1651 236.671 42.4909C236.751 39.8168 236.048 37.1775 234.648 34.8975V34.902Z"
                        fill="white"
                      />
                      <path
                        d="M211.581 49.5675C210.58 48.0693 209.889 46.3864 209.547 44.6175C209.212 42.831 209.233 40.9957 209.61 39.2175C209.984 37.4396 210.714 35.7558 211.757 34.2675C212.794 32.7717 214.119 31.4983 215.656 30.5223C217.192 29.5462 218.908 28.8872 220.703 28.584C222.494 28.2687 224.331 28.3207 226.103 28.737C227.867 29.1557 229.531 29.9205 230.999 30.987C232.449 32.0463 233.673 33.3851 234.599 34.9245C232.608 31.9319 229.53 29.8332 226.017 29.0745C224.289 28.7051 222.505 28.6746 220.766 28.9845C217.262 29.6307 214.146 31.6099 212.071 34.506C210.532 36.6932 209.664 39.2827 209.576 41.9561C209.489 44.6295 210.184 47.2704 211.577 49.554L211.581 49.5675Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M217.62 36.5535L217.728 35.9055C217.768 35.6895 217.8 35.4555 217.845 35.262L218.092 33.9705V33.885H218.187C219.451 34.137 220.707 34.4115 221.962 34.7085L221.854 34.7805L222.16 33.5385L222.322 32.9175C222.376 32.7105 222.43 32.5035 222.489 32.301C222.457 32.5125 222.421 32.7195 222.385 32.931L222.273 33.561L222.03 34.8165V34.9065H221.935C220.675 34.6545 219.415 34.3755 218.16 34.083L218.268 34.011L217.957 35.2845C217.908 35.496 217.845 35.7075 217.791 35.919C217.737 36.1305 217.683 36.342 217.62 36.5535Z"
                        fill="white"
                      />
                      <path
                        d="M215.122 47.9385C215.199 47.4885 215.28 47.0745 215.361 46.6425C215.442 46.2105 215.532 45.783 215.613 45.351V45.2835H215.685L216.81 45.5085L216.697 45.5805L217.147 43.371C217.305 42.6375 217.476 41.904 217.638 41.1705C217.8 40.437 217.975 39.7035 218.151 38.97C218.326 38.2365 218.506 37.512 218.695 36.783C218.565 37.521 218.43 38.2635 218.281 39.0015C218.133 39.7395 217.989 40.4775 217.831 41.211C217.674 41.9445 217.525 42.6825 217.359 43.416L216.9 45.63V45.72H216.81L215.694 45.4545L215.779 45.4005C215.676 45.8505 215.577 46.2555 215.469 46.6785C215.361 47.1015 215.235 47.511 215.122 47.9385Z"
                        fill="white"
                      />
                      <path
                        d="M221.188 46.575C221.436 46.602 221.683 46.647 221.931 46.683L222.669 46.8135C222.902 46.8451 223.139 46.8247 223.363 46.7539C223.587 46.6831 223.793 46.5636 223.965 46.404C224.306 46.0684 224.51 45.6175 224.536 45.1395C224.559 44.8998 224.533 44.658 224.46 44.4285C224.39 44.191 224.272 43.9704 224.113 43.7805C224.303 43.9498 224.454 44.158 224.556 44.391C224.658 44.6241 224.708 44.8763 224.703 45.1305C224.705 45.394 224.653 45.655 224.551 45.8979C224.449 46.1407 224.298 46.3604 224.109 46.5435C223.914 46.7248 223.678 46.8569 223.421 46.9289C223.164 47.0009 222.894 47.0107 222.633 46.9575C222.147 46.8495 221.665 46.7235 221.188 46.575Z"
                        fill="white"
                      />
                      <path
                        d="M222.444 40.8285C222.853 40.8735 223.267 40.941 223.663 41.004C223.854 41.0111 224.044 40.9742 224.218 40.8961C224.392 40.8181 224.545 40.701 224.667 40.554C224.915 40.251 225.056 39.8744 225.067 39.483C225.093 39.0788 224.998 38.676 224.793 38.3265C225.075 38.6465 225.235 39.0564 225.243 39.483C225.26 39.9224 225.116 40.353 224.838 40.6935C224.692 40.8609 224.506 40.9896 224.298 41.0681C224.09 41.1466 223.866 41.1725 223.645 41.1435C223.222 41.076 222.84 40.95 222.444 40.8285Z"
                        fill="white"
                      />
                      <path
                        d="M218.921 48.7665C218.895 49.5406 218.727 50.3033 218.426 51.0165C218.452 50.2427 218.62 49.4802 218.921 48.7665Z"
                        fill="white"
                      />
                      <path
                        d="M221.499 49.3605C221.492 49.747 221.444 50.1317 221.355 50.508C221.279 50.8854 221.163 51.2535 221.009 51.606C221.012 51.2195 221.059 50.8346 221.148 50.4585C221.226 50.0812 221.344 49.7131 221.499 49.3605Z"
                        fill="white"
                      />
                      <path
                        d="M114.331 0H113.881V14.733H114.331V0Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M123.214 23.508L122.481 25.119H105.732L105.003 23.508L112.131 18.576H116.082L123.214 23.508Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M116.577 13.8195L116.082 18.576H112.131L111.641 13.8195H116.577Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M123.21 23.5125L122.481 25.119H105.732L105.003 23.5125H123.21Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M150.759 0H150.309V14.733H150.759V0Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M159.642 23.508L158.908 25.119H142.164L141.43 23.508L148.563 18.576H152.509L159.642 23.508Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M153.004 13.8195L152.509 18.576H148.563L148.068 13.8195H153.004Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M159.637 23.5125L158.908 25.119H142.159L141.43 23.5125H159.637Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M187.191 0H186.741V14.733H187.191V0Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M196.069 23.508L195.336 25.119H178.591L177.862 23.508L184.99 18.576H188.941L196.069 23.508Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M189.432 13.8195L188.941 18.576H184.99L184.495 13.8195H189.432Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M196.07 23.5125L195.336 25.119H178.592L177.858 23.5125H196.07Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M223.618 0H223.168V14.733H223.618V0Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M232.497 23.508L231.764 25.119H215.019L214.29 23.508L221.418 18.576H225.369L232.497 23.508Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M225.864 13.8195L225.369 18.576H221.418L220.923 13.8195H225.864Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M232.497 23.5125L231.764 25.119H215.019L214.286 23.5125H232.497Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M54.396 118.899C48.7395 126.563 42.84 135.45 41.4 145.058C41.4006 145.088 41.4117 145.117 41.4313 145.14C41.4509 145.163 41.4778 145.178 41.5076 145.183C41.5373 145.189 41.5679 145.184 41.5943 145.169C41.6206 145.154 41.641 145.131 41.652 145.103C42.3008 142.483 43.1354 139.913 44.1495 137.412C47.871 136.391 51.5205 135.549 53.4735 131.859C55.4625 128.066 55.2105 123.12 54.8235 118.985C54.81 118.764 54.5085 118.755 54.396 118.899Z"
                        fill="#00FFB2"
                      />
                      <path
                        d="M44.2125 137.34C46.7505 131.639 50.013 125.915 54.162 121.226C54.189 121.194 54.2295 121.226 54.207 121.271C51.507 124.61 49.428 128.25 47.4165 131.949C49.2885 130.046 51.3405 128.349 53.1135 126.329C53.1495 126.288 53.2035 126.329 53.172 126.383C51.408 128.498 49.4865 130.797 47.1915 132.359C46.575 133.493 45.954 134.636 45.324 135.774C45.477 135.689 45.639 135.608 45.774 135.531C45.801 135.531 45.828 135.558 45.774 135.572C45.5985 135.662 45.4275 135.756 45.2475 135.833C44.9505 136.373 44.6535 136.908 44.3475 137.448C44.325 137.565 44.1585 137.462 44.2125 137.34Z"
                        fill="#263238"
                      />
                      <path
                        d="M46.1025 135.351C47.6236 134.5 49.0755 133.531 50.445 132.453C50.481 132.426 50.535 132.476 50.4945 132.507C49.1695 133.654 47.7169 134.644 46.1655 135.459C46.0935 135.495 46.0305 135.392 46.1025 135.351Z"
                        fill="#263238"
                      />
                      <path
                        d="M40.752 143.627C40.752 143.654 40.7629 143.68 40.7823 143.7C40.8017 143.719 40.828 143.73 40.8555 143.73C40.8829 143.73 40.9093 143.719 40.9287 143.7C40.9481 143.68 40.959 143.654 40.959 143.627C40.986 140.477 40.959 137.286 41.0085 134.109C41.8185 132.476 43.5555 131.567 44.766 130.257C45.6347 129.297 46.3897 128.24 47.016 127.107C48.4715 124.406 49.3611 121.437 49.6305 118.382C49.9635 114.998 48.681 103.833 47.2545 104.22C46.5165 104.423 44.1045 109.953 43.488 111.78C42.4601 114.796 41.707 117.899 41.238 121.05C40.0905 128.493 40.185 136.139 40.752 143.627Z"
                        fill="#00FFB2"
                      />
                      <path
                        d="M40.7295 129.982C40.9005 125.982 41.805 121.936 42.6465 118.057C43.5465 113.873 44.622 109.957 46.773 106.204C46.8135 106.137 46.917 106.204 46.881 106.267C45.4422 109.168 44.3299 112.22 43.5645 115.366C43.7085 115.137 43.884 114.916 44.0145 114.714C44.073 114.628 44.208 114.714 44.1495 114.795C43.9581 115.133 43.7335 115.451 43.479 115.744H43.452C42.7095 118.732 42.1785 121.788 41.724 124.839L41.823 124.722C41.8284 124.717 41.8352 124.715 41.8422 124.715C41.8493 124.714 41.8562 124.716 41.8619 124.721C41.8676 124.725 41.8718 124.731 41.8737 124.737C41.8756 124.744 41.8752 124.751 41.8725 124.758L41.688 125.059C41.463 126.607 41.2455 128.149 41.0355 129.685C43.7895 127.327 46.143 124.551 47.475 121.135C46.1745 124.686 44.127 127.84 40.968 129.996L40.7925 131.229C40.7925 131.314 40.644 131.292 40.6485 131.229C40.6485 130.864 40.6485 130.5 40.68 130.131C40.6651 130.121 40.6539 130.107 40.648 130.09C40.6422 130.073 40.6421 130.055 40.6477 130.038C40.6534 130.021 40.6644 130.006 40.6792 129.996C40.694 129.986 40.7117 129.981 40.7295 129.982Z"
                        fill="#263238"
                      />
                      <path
                        d="M42.0255 124.2C44.1315 121.05 46.1025 118.004 47.6415 114.53C47.6415 114.489 47.727 114.53 47.709 114.557C46.413 118.008 44.5905 121.509 42.1335 124.281C42.084 124.322 41.985 124.245 42.0255 124.2Z"
                        fill="#263238"
                      />
                      <path
                        d="M44.8245 113.733C45.6975 112.19 46.6245 110.687 47.439 109.112C47.439 109.071 47.5245 109.112 47.5065 109.152C46.8288 110.794 45.9747 112.357 44.9595 113.814C44.9467 113.827 44.93 113.835 44.912 113.837C44.894 113.84 44.8757 113.836 44.8601 113.827C44.8446 113.817 44.8326 113.803 44.8261 113.786C44.8196 113.769 44.8191 113.75 44.8245 113.733Z"
                        fill="#263238"
                      />
                      <path
                        d="M38.61 134.478C38.5677 136.575 38.3205 138.662 37.872 140.711C37.9035 140.936 37.935 141.161 37.9665 141.395C38.613 139.131 38.9876 136.799 39.0825 134.447C39.1015 134.414 39.1115 134.376 39.1115 134.339C39.1115 134.301 39.1015 134.263 39.0825 134.231C39.1742 131.077 38.9404 127.922 38.385 124.817C37.404 119.003 35.2665 113.427 31.212 109.067C31.1781 109.038 31.1381 109.018 31.0952 109.007C31.0522 108.996 31.0074 108.995 30.9641 109.004C30.9207 109.014 30.88 109.032 30.845 109.06C30.81 109.087 30.7817 109.121 30.762 109.161C29.1285 113.319 29.7 118.283 31.0905 122.436C31.8512 124.681 32.9351 126.803 34.308 128.736C35.7075 130.689 37.4805 132.345 38.61 134.478Z"
                        fill="#00FFB2"
                      />
                      <path
                        d="M31.698 111.011C35.55 117.248 38.214 124.65 38.5425 132.008C38.5425 132.138 38.3265 132.174 38.3085 132.039C38.2185 131.376 38.1195 130.719 38.0115 130.068C36.4185 128.547 34.7895 126.941 33.651 125.037C33.6489 125.03 33.649 125.022 33.6513 125.015C33.6536 125.008 33.658 125.002 33.6639 124.998C33.6698 124.994 33.6769 124.991 33.6842 124.991C33.6915 124.991 33.6988 124.993 33.705 124.997C35.0225 126.613 36.435 128.151 37.935 129.6C37.6605 127.971 37.3365 126.369 36.9495 124.79L36.6435 124.434C36.576 124.353 36.6885 124.241 36.756 124.317L36.8505 124.421C36.3083 122.256 35.6381 120.125 34.8435 118.04C33.8625 116.874 32.769 115.866 32.058 114.462C32.0538 114.459 32.0505 114.455 32.0483 114.45C32.046 114.446 32.0449 114.441 32.0451 114.436C32.0452 114.43 32.0467 114.425 32.0492 114.421C32.0517 114.417 32.0553 114.413 32.0597 114.41C32.064 114.407 32.0689 114.406 32.074 114.405C32.0791 114.405 32.0843 114.406 32.089 114.408C32.0937 114.41 32.0978 114.413 32.1011 114.417C32.1043 114.421 32.1065 114.425 32.1075 114.431C32.679 115.236 33.237 116.042 33.9075 116.789C34.1685 117.086 34.452 117.365 34.7175 117.653C33.8321 115.392 32.7791 113.2 31.5675 111.096C31.5649 111.08 31.567 111.063 31.5737 111.048C31.5804 111.033 31.5913 111.02 31.6051 111.011C31.6188 111.002 31.635 110.997 31.6514 110.997C31.6679 110.997 31.6841 111.002 31.698 111.011Z"
                        fill="#263238"
                      />
                      <path
                        d="M32.4765 118.701C33.7185 120.375 35.1315 121.968 36.288 123.696C36.3195 123.746 36.2475 123.795 36.207 123.759C34.7265 122.368 33.471 120.465 32.391 118.751C32.3595 118.697 32.4405 118.656 32.4765 118.701Z"
                        fill="#263238"
                      />
                      <path
                        d="M36.45 124.083L36.4995 124.137C36.54 124.173 36.4995 124.232 36.4455 124.196L36.3915 124.142C36.369 124.106 36.45 124.047 36.45 124.083Z"
                        fill="#263238"
                      />
                      <path
                        d="M25.677 122.999C26.128 126.481 27.5292 129.772 29.727 132.512C30.6304 133.587 31.7495 134.461 33.012 135.077C34.4385 135.783 35.928 136.593 37.3995 137.174C38.1009 138.956 38.6225 140.804 38.9565 142.691C39.0015 142.529 39.051 142.362 39.096 142.205C38.16 134.1 32.904 127.134 26.181 122.679C26.1283 122.645 26.0669 122.627 26.0041 122.626C25.9413 122.626 25.8797 122.644 25.8267 122.677C25.7737 122.711 25.7314 122.759 25.7048 122.816C25.6783 122.873 25.6686 122.936 25.677 122.999Z"
                        fill="#00FFB2"
                      />
                      <path
                        d="M28.0035 125.397C27.954 125.357 28.0035 125.271 28.071 125.312C31.7595 128.06 34.6994 131.689 36.621 135.869C36.6705 135.981 36.5175 136.076 36.4545 135.968C36.1395 135.419 35.82 134.888 35.496 134.361C33.9615 134.069 32.508 133.011 31.3695 131.963C31.338 131.936 31.3695 131.891 31.4145 131.918C32.0022 132.449 32.6555 132.902 33.3585 133.268C33.9944 133.558 34.6448 133.817 35.307 134.042C34.74 133.142 34.146 132.273 33.5295 131.432C31.8716 130.802 30.317 129.928 28.917 128.84C28.872 128.808 28.917 128.736 28.9575 128.768C30.3458 129.606 31.7773 130.37 33.246 131.058C32.3083 129.822 31.297 128.644 30.2175 127.53C29.6955 127.256 29.169 126.977 28.665 126.684C28.657 126.678 28.6512 126.67 28.6484 126.66C28.6456 126.651 28.6461 126.641 28.6497 126.631C28.6533 126.622 28.6598 126.614 28.6683 126.609C28.6767 126.604 28.6866 126.602 28.6965 126.603C29.1158 126.752 29.5161 126.95 29.889 127.193C29.295 126.594 28.6695 126 28.0035 125.397Z"
                        fill="#263238"
                      />
                      <path
                        d="M28.1475 128.205C28.2376 128.26 28.3233 128.322 28.404 128.39C28.431 128.412 28.404 128.444 28.3725 128.43C28.2778 128.388 28.1873 128.337 28.1025 128.277C28.0575 128.25 28.098 128.174 28.1475 128.205Z"
                        fill="#263238"
                      />
                      <path
                        d="M49.599 160.281H31.176L32.661 143.505L32.9895 139.806H47.7855L48.114 143.505L49.599 160.281Z"
                        fill="#455A64"
                      />
                      <path
                        d="M48.114 143.505H32.661L32.9895 139.806H47.7855L48.114 143.505Z"
                        fill="#263238"
                      />
                      <path
                        d="M48.6675 137.219H32.1075V140.882H48.6675V137.219Z"
                        fill="#455A64"
                      />
                      <path
                        d="M22.824 160.281L59.3055 160.173L95.787 160.132L168.75 160.056L241.713 160.132L278.194 160.173L314.676 160.281L278.194 160.393L241.713 160.429L168.75 160.506L95.787 160.429L59.3055 160.393L22.824 160.281Z"
                        fill="#263238"
                      />
                      <path
                        d="M218.615 36.279L218.165 36.2025L218.237 35.7525L218.687 35.829L218.615 36.279Z"
                        fill="#263238"
                      />
                      <path
                        d="M192.492 42.4935L192.195 42.156C192.411 41.9625 192.645 41.76 192.897 41.553L193.185 41.8995C192.933 42.1065 192.704 42.3 192.492 42.4935ZM193.896 41.3325L193.622 40.977C193.86 40.797 194.108 40.6125 194.369 40.428L194.63 40.797C194.373 40.977 194.13 41.157 193.896 41.3325ZM195.381 40.284L195.134 39.906C195.386 39.7395 195.647 39.5775 195.921 39.411L196.151 39.798C195.884 39.966 195.627 40.128 195.381 40.284ZM196.938 39.339L196.718 38.9475C196.983 38.799 197.253 38.6505 197.532 38.4975L197.739 38.898C197.465 39.0465 197.199 39.195 196.938 39.339ZM198.558 38.502L198.365 38.097C198.635 37.9665 198.918 37.836 199.206 37.71L199.386 38.124C199.103 38.25 198.824 38.3715 198.558 38.502ZM200.25 37.773L200.084 37.3545C200.363 37.242 200.651 37.134 200.948 37.026L201.101 37.449C200.786 37.557 200.502 37.6605 200.25 37.773ZM201.96 37.1565L201.821 36.7065C202.113 36.6165 202.406 36.522 202.721 36.4365L202.847 36.8865C202.5 36.972 202.221 37.062 201.938 37.1565H201.96ZM203.711 36.648L203.598 36.198C203.891 36.1215 204.192 36.0495 204.498 35.982L204.597 36.432C204.273 36.4995 203.976 36.5715 203.688 36.648H203.711ZM205.488 36.243L205.403 35.793C205.7 35.7345 206.006 35.6805 206.303 35.631L206.375 36.081L205.488 36.243ZM217.292 36.063L216.392 35.946L216.446 35.496L217.346 35.6175L217.292 36.063ZM207.288 35.9505L207.225 35.5005C207.525 35.4585 207.825 35.4225 208.125 35.3925L208.175 35.8425C207.866 35.8755 207.563 35.9115 207.266 35.9505H207.288ZM215.478 35.8425L214.578 35.766L214.61 35.316L215.532 35.397L215.478 35.8425ZM209.097 35.7615L209.066 35.3115C209.367 35.3115 209.673 35.2665 209.966 35.253L209.988 35.703C209.7 35.7165 209.376 35.7345 209.075 35.7615H209.097ZM213.656 35.7075C213.35 35.7075 213.044 35.6805 212.756 35.6715V35.2215C213.062 35.2215 213.368 35.2215 213.678 35.2575L213.656 35.7075ZM210.92 35.667V35.217H211.775H211.842V35.667H211.775H210.92Z"
                        fill="#263238"
                      />
                      <path
                        d="M191.516 43.4295L191.192 43.1145L191.511 42.795L191.826 43.1145L191.516 43.4295Z"
                        fill="#263238"
                      />
                      <path
                        d="M192.285 40.4325L192.69 40.6215L191.439 43.29L194.112 42.0525L194.301 42.462L190.508 44.217L192.285 40.4325Z"
                        fill="#263238"
                      />
                      <path
                        d="M265.532 82.9215H265.082C265.082 82.9215 265.082 82.7685 265.082 82.4715H265.532C265.536 82.7595 265.532 82.9215 265.532 82.9215Z"
                        fill="#263238"
                      />
                      <path
                        d="M265.018 81.612C265.018 81.36 264.969 81.072 264.924 80.7525L265.374 80.694C265.419 81.018 265.45 81.315 265.473 81.594L265.018 81.612ZM264.798 79.893C264.753 79.623 264.703 79.3395 264.64 79.038L265.09 78.948C265.153 79.254 265.207 79.5465 265.252 79.821L264.798 79.893ZM264.456 78.1875C264.393 77.9175 264.325 77.634 264.244 77.346L264.694 77.229C264.771 77.526 264.843 77.8095 264.91 78.084L264.456 78.1875ZM264.006 76.509C263.925 76.239 263.839 75.96 263.745 75.6765L264.195 75.537C264.285 75.825 264.375 76.104 264.456 76.3785L264.006 76.509ZM263.466 74.853C263.367 74.5875 263.268 74.3175 263.16 74.0385L263.578 73.8765C263.686 74.1555 263.79 74.43 263.889 74.7L263.466 74.853ZM262.831 73.233C262.723 72.972 262.606 72.702 262.485 72.4365L262.894 72.2475C263.02 72.522 263.137 72.792 263.25 73.0575L262.831 73.233ZM262.116 71.649C261.994 71.388 261.864 71.1315 261.729 70.866L262.129 70.6635C262.264 70.929 262.395 71.19 262.521 71.451L262.116 71.649ZM261.319 70.101C261.184 69.849 261.04 69.597 260.869 69.3405L261.261 69.1155C261.411 69.3705 261.561 69.627 261.711 69.885L261.319 70.101ZM260.446 68.5935C260.298 68.3505 260.145 68.103 259.996 67.8555L260.374 67.6125C260.536 67.86 260.694 68.112 260.824 68.3595L260.446 68.5935ZM259.506 67.131C259.344 66.891 259.177 66.6525 259.006 66.4155L259.371 66.1545C259.546 66.3975 259.713 66.636 259.875 66.879L259.506 67.131ZM258.498 65.7C258.322 65.4705 258.147 65.25 257.967 65.007L258.322 64.728L258.858 65.43L258.498 65.7ZM257.422 64.35C257.238 64.1295 257.053 63.9 256.86 63.684L257.202 63.3915C257.397 63.6165 257.586 63.8415 257.769 64.0665L257.422 64.35ZM256.289 63C256.095 62.7885 255.901 62.5725 255.699 62.3565L256.027 62.0505C256.23 62.2665 256.428 62.5005 256.621 62.703L256.289 63Z"
                        fill="#263238"
                      />
                      <path
                        d="M255.096 61.74L254.781 61.4205L255.101 61.1055L255.42 61.4295L255.096 61.74Z"
                        fill="#263238"
                      />
                      <path
                        d="M257.796 62.1945L257.603 62.5995L254.948 61.317L256.154 64.008L255.744 64.1925L254.03 60.372L257.796 62.1945Z"
                        fill="#263238"
                      />
                      <path
                        d="M259.484 51.867C258.243 54.8555 256.144 57.4093 253.453 59.2058C250.762 61.0023 247.598 61.961 244.363 61.9608C241.127 61.9606 237.964 61.0015 235.273 59.2046C232.582 57.4077 230.484 54.8536 229.243 51.8649C228.003 48.8763 227.676 45.5871 228.304 42.4128C228.932 39.2385 230.487 36.3215 232.771 34.0302C235.056 31.7389 237.969 30.1761 241.141 29.5391C244.314 28.9022 247.604 29.2197 250.596 30.4515C252.587 31.2725 254.397 32.478 255.921 33.9991C257.446 35.5202 258.655 37.327 259.481 39.3162C260.306 41.3053 260.732 43.4377 260.732 45.5913C260.732 47.7449 260.308 49.8775 259.484 51.867Z"
                        fill="#00FFB2"
                      />
                      <path
                        opacity="0.1"
                        d="M259.484 51.867C258.243 54.8555 256.144 57.4093 253.453 59.2058C250.762 61.0023 247.598 61.961 244.363 61.9608C241.127 61.9606 237.964 61.0015 235.273 59.2046C232.582 57.4077 230.484 54.8536 229.243 51.8649C228.003 48.8763 227.676 45.5871 228.304 42.4128C228.932 39.2385 230.487 36.3215 232.771 34.0302C235.056 31.7389 237.969 30.1761 241.141 29.5391C244.314 28.9022 247.604 29.2197 250.596 30.4515C252.587 31.2725 254.397 32.478 255.921 33.9991C257.446 35.5202 258.655 37.327 259.481 39.3162C260.306 41.3053 260.732 43.4377 260.732 45.5913C260.732 47.7449 260.308 49.8775 259.484 51.867Z"
                        fill="black"
                      />
                      <g opacity="0.1">
                        <path
                          d="M238.586 59.652C235.8 58.5111 233.417 56.5692 231.736 54.0723C230.056 51.5754 229.155 48.6359 229.147 45.6262C229.139 42.6165 230.024 39.6722 231.691 37.1663C233.358 34.6604 235.731 32.7057 238.51 31.5499C241.289 30.3942 244.349 30.0893 247.301 30.674C250.253 31.2588 252.965 32.7067 255.094 34.8344C257.223 36.9621 258.672 39.6738 259.258 42.6259C259.844 45.578 259.54 48.6376 258.386 51.417C256.846 55.1296 253.898 58.0808 250.187 59.6243C246.475 61.1678 242.304 61.1777 238.586 59.652ZM256.865 51.048C257.941 48.5794 258.262 45.8477 257.788 43.1968C257.315 40.5459 256.067 38.0944 254.203 36.1511C252.339 34.2078 249.942 32.8596 247.313 32.2763C244.684 31.6929 241.941 31.9006 239.43 32.873C236.919 33.8455 234.751 35.5393 233.201 37.741C231.651 39.9428 230.787 42.5542 230.718 45.2461C230.648 47.9381 231.377 50.5903 232.813 52.8688C234.248 55.1472 236.326 56.95 238.784 58.05C240.429 58.7859 242.205 59.1884 244.007 59.2344C245.809 59.2803 247.602 58.9688 249.284 58.3178C250.965 57.6668 252.5 56.6891 253.801 55.4413C255.103 54.1936 256.144 52.7004 256.865 51.048Z"
                          fill="black"
                        />
                        <path
                          d="M247.95 36.7065L249.399 37.3005L249.228 37.7145C248.994 38.2815 248.778 38.8485 248.526 39.4065C248.436 39.6135 248.49 39.6945 248.684 39.807C249.257 40.1206 249.804 40.4787 250.322 40.878C251.6 41.9625 251.852 43.371 251.109 44.874C250.973 45.1458 250.823 45.4102 250.659 45.666C250.451 45.974 250.175 46.2295 249.852 46.4122C249.528 46.595 249.167 46.7 248.796 46.719L248.211 46.7685C248.409 46.9665 248.594 47.1285 248.756 47.313C249.201 47.7761 249.5 48.361 249.614 48.9937C249.727 49.6264 249.651 50.2786 249.395 50.868C249.191 51.4742 248.866 52.0329 248.441 52.5105C248.153 52.822 247.805 53.0722 247.419 53.2462C247.032 53.4202 246.614 53.5143 246.191 53.523C245.201 53.5338 244.218 53.3472 243.302 52.974C243.081 52.8975 242.982 52.911 242.892 53.145C242.676 53.7075 242.442 54.252 242.199 54.81C242.141 54.945 242.073 55.008 241.929 54.9495L240.678 54.45L240.89 53.928C241.083 53.478 241.272 52.983 241.475 52.5195C241.542 52.3575 241.529 52.2675 241.349 52.2045C241.074 52.1055 240.809 51.984 240.507 51.8625C240.21 52.5915 239.922 53.289 239.607 54L238.158 53.406C238.451 52.695 238.734 51.9975 239.031 51.2685L235.431 49.7925L236.43 47.358L237.492 47.808C238.635 45.0135 239.769 42.2505 240.917 39.4605L239.864 39.0105L240.858 36.585L244.431 38.052C244.764 37.2465 245.079 36.4725 245.403 35.685L246.843 36.2745L245.885 38.61L246.951 39.06C247.302 38.25 247.617 37.503 247.95 36.7065ZM243.729 46.4445C243.491 46.35 243.248 46.2555 243.014 46.1475C242.856 46.08 242.78 46.1205 242.721 46.2735C242.331 47.2425 241.935 48.207 241.533 49.167C241.452 49.3515 241.511 49.428 241.682 49.4955C242.1 49.6575 242.514 49.8375 242.937 50.004C243.313 50.1719 243.738 50.193 244.129 50.0631C244.519 49.9331 244.847 49.6616 245.048 49.302C245.211 49.0848 245.321 48.8316 245.368 48.5635C245.414 48.2953 245.396 48.02 245.314 47.7604C245.233 47.5007 245.091 47.2642 244.899 47.0706C244.708 46.877 244.474 46.7317 244.215 46.647L243.729 46.4445ZM244.26 42.5205C244.089 42.9345 243.927 43.344 243.752 43.7535C243.693 43.8885 243.707 43.974 243.86 44.0325C244.31 44.199 244.728 44.388 245.178 44.5365C245.404 44.6156 245.65 44.614 245.875 44.5319C246.1 44.4499 246.289 44.2925 246.411 44.0865C246.589 43.8171 246.73 43.525 246.83 43.218C246.887 43.0558 246.912 42.8839 246.902 42.7121C246.893 42.5404 246.849 42.3722 246.774 42.2173C246.699 42.0625 246.595 41.924 246.466 41.81C246.337 41.6959 246.187 41.6086 246.024 41.553C245.705 41.418 245.376 41.2965 245.052 41.1525C244.899 41.0805 244.823 41.121 244.76 41.274C244.589 41.706 244.418 42.111 244.251 42.5205H244.26Z"
                          fill="black"
                        />
                      </g>
                      <path
                        d="M256.95 40.3335C257.679 41.9779 258.074 43.7507 258.111 45.549C258.136 47.3629 257.804 49.164 257.134 50.85C256.46 52.5337 255.453 54.0641 254.174 55.35C252.898 56.6478 251.376 57.6775 249.696 58.3784C248.017 59.0794 246.215 59.4374 244.395 59.4315C242.577 59.4345 240.777 59.0702 239.103 58.3605C237.436 57.6533 235.925 56.6242 234.657 55.332C233.4 54.0456 232.412 52.5221 231.75 50.85C232.826 53.2981 234.594 55.3786 236.837 56.836C239.079 58.2933 241.698 59.064 244.372 59.0535C246.138 59.038 247.883 58.6788 249.511 57.996C251.145 57.3232 252.629 56.3354 253.881 55.089C255.775 53.1961 257.074 50.7911 257.619 48.1696C258.165 45.5482 257.932 42.8245 256.95 40.3335Z"
                        fill="white"
                      />
                      <path
                        opacity="0.1"
                        d="M231.692 50.778C230.964 49.1305 230.574 47.3541 230.544 45.5535C230.525 43.7432 230.862 41.9468 231.534 40.266C232.216 38.5828 233.227 37.0528 234.509 35.766C235.789 34.4721 237.316 33.4473 238.998 32.7517C240.68 32.0562 242.485 31.7041 244.305 31.716C246.121 31.7202 247.917 32.089 249.588 32.8005C251.253 33.5132 252.76 34.5469 254.025 35.8425C255.273 37.1369 256.25 38.6666 256.901 40.3425C255.833 37.8892 254.072 35.8017 251.833 34.3369C249.594 32.8721 246.976 32.094 244.301 32.0985C240.74 32.1294 237.33 33.5392 234.788 36.0315C232.892 37.9192 231.589 40.3197 231.039 42.9379C230.489 45.5561 230.716 48.278 231.692 50.769V50.778Z"
                        fill="black"
                      />
                      <path
                        d="M239.895 39.006C239.963 38.799 240.039 38.592 240.111 38.385C240.183 38.178 240.26 37.9755 240.336 37.773L240.786 36.5445L240.818 36.4635L240.903 36.495C242.103 36.963 243.303 37.452 244.503 37.962L244.386 38.0115L244.904 36.8415L245.169 36.261C245.255 36.0675 245.349 35.874 245.439 35.6805C245.372 35.883 245.3 36.0855 245.228 36.2835L245.003 36.9L244.553 38.097L244.521 38.178L244.436 38.1465C243.236 37.6785 242.043 37.1895 240.858 36.6795L240.98 36.63L240.444 37.8C240.359 38.0025 240.264 38.2005 240.174 38.3985L239.895 39.006Z"
                        fill="white"
                      />
                      <path
                        d="M235.463 49.7835C235.611 49.374 235.769 48.9645 235.913 48.5505C236.057 48.1365 236.228 47.7315 236.385 47.322L236.412 47.259L236.48 47.286L237.546 47.7L237.429 47.754L238.271 45.6615C238.554 44.9595 238.851 44.271 239.135 43.5735C239.418 42.876 239.724 42.192 240.035 41.499C240.345 40.806 240.638 40.122 240.935 39.438C240.674 40.1445 240.413 40.851 240.138 41.5485C239.864 42.246 239.594 42.9525 239.31 43.65C239.027 44.3475 238.752 45.045 238.464 45.738L237.6 47.8215L237.564 47.907L237.479 47.871L236.426 47.421L236.52 47.385C236.345 47.7855 236.174 48.1905 235.994 48.591C235.814 48.9915 235.647 49.3875 235.463 49.7835Z"
                        fill="white"
                      />
                      <path
                        d="M241.673 49.5C241.911 49.572 242.145 49.6575 242.384 49.734L243.086 49.9905C243.31 50.0621 243.547 50.0832 243.781 50.052C244.014 50.0209 244.238 49.9384 244.436 49.8105C244.832 49.542 245.111 49.1337 245.219 48.6675C245.282 48.4346 245.299 48.1914 245.268 47.952C245.243 47.7056 245.165 47.4676 245.039 47.2545C245.2 47.4552 245.315 47.6896 245.374 47.9403C245.433 48.191 245.435 48.4517 245.381 48.7035C245.338 48.9633 245.243 49.2116 245.1 49.433C244.958 49.6544 244.771 49.8441 244.553 49.9905C244.33 50.136 244.075 50.2258 243.811 50.2524C243.546 50.279 243.279 50.2417 243.032 50.1435C242.55 49.95 242.1 49.725 241.673 49.5Z"
                        fill="white"
                      />
                      <path
                        d="M243.9 44.055C244.296 44.1675 244.697 44.307 245.07 44.4375C245.256 44.4796 245.448 44.4783 245.633 44.4339C245.818 44.3894 245.99 44.3028 246.137 44.181C246.431 43.9255 246.635 43.5812 246.717 43.2C246.815 42.8059 246.789 42.3914 246.645 42.012C246.868 42.3767 246.951 42.8101 246.879 43.2315C246.82 43.6666 246.604 44.0651 246.272 44.352C246.1 44.4939 245.896 44.5912 245.678 44.6351C245.459 44.6791 245.234 44.6684 245.021 44.604C244.629 44.433 244.269 44.2485 243.9 44.055Z"
                        fill="white"
                      />
                      <path
                        d="M239.054 51.2595C238.898 52.0201 238.602 52.7451 238.181 53.397C238.254 53.0157 238.367 52.6432 238.518 52.2855C238.662 51.9266 238.842 51.5829 239.054 51.2595Z"
                        fill="white"
                      />
                      <path
                        d="M241.493 52.2945C241.336 53.0506 241.04 53.7709 240.62 54.4185C240.776 53.6624 241.072 52.9421 241.493 52.2945Z"
                        fill="white"
                      />
                      <path
                        d="M250.65 49.473C250.637 52.7095 249.664 55.8694 247.856 58.5535C246.047 61.2376 243.484 63.3253 240.489 64.553C237.494 65.7807 234.203 66.0931 231.031 65.4509C227.859 64.8087 224.948 63.2407 222.667 60.9449C220.385 58.6491 218.836 55.7286 218.214 52.5524C217.591 49.3763 217.925 46.087 219.171 43.1001C220.418 40.1133 222.522 37.5629 225.217 35.7714C227.913 33.9798 231.079 33.0274 234.315 33.0345C236.468 33.0392 238.598 33.4684 240.585 34.2974C242.571 35.1265 244.374 36.3392 245.892 37.866C247.409 39.3929 248.61 41.204 249.427 43.1957C250.243 45.1873 250.659 47.3205 250.65 49.473Z"
                        fill="#00FFB2"
                      />
                      <g opacity="0.1">
                        <path
                          d="M234.288 64.6065C231.279 64.6056 228.338 63.7117 225.838 62.038C223.337 60.3644 221.389 57.9863 220.241 55.2049C219.093 52.4235 218.797 49.364 219.389 46.4139C219.981 43.4638 221.436 40.7558 223.568 38.6329C225.7 36.51 228.415 35.0677 231.367 34.4886C234.32 33.9096 237.378 34.2199 240.155 35.3802C242.931 36.5405 245.3 38.4987 246.963 41.0067C248.625 43.5146 249.506 46.4596 249.494 49.4685C249.48 53.491 247.872 57.344 245.021 60.1821C242.171 63.0201 238.311 64.6113 234.288 64.6065ZM247.95 49.707C248.01 47.0146 247.272 44.3646 245.828 42.0909C244.385 39.8172 242.301 38.0216 239.839 36.9301C237.377 35.8386 234.647 35.5002 231.993 35.9574C229.339 36.4146 226.88 37.647 224.925 39.4993C222.97 41.3517 221.607 43.7412 221.008 46.3667C220.408 48.9923 220.599 51.7365 221.557 54.2537C222.514 56.7709 224.195 58.9485 226.388 60.5121C228.58 62.0757 231.187 62.9555 233.879 63.0405C235.68 63.0962 237.474 62.7948 239.158 62.1536C240.843 61.5124 242.383 60.5441 243.691 59.3045C245 58.065 246.049 56.5788 246.78 54.9315C247.511 53.2843 247.909 51.5087 247.95 49.707Z"
                          fill="black"
                        />
                        <path
                          d="M234.234 39.825H235.8V40.275C235.8 40.8825 235.8 41.4945 235.8 42.102C235.8 42.3315 235.877 42.3855 236.097 42.417C236.747 42.4848 237.39 42.6083 238.019 42.786C239.612 43.3035 240.381 44.505 240.269 46.179C240.25 46.4813 240.211 46.782 240.152 47.079C240.076 47.442 239.917 47.7825 239.687 48.0738C239.458 48.365 239.164 48.599 238.829 48.7575C238.667 48.8475 238.505 48.924 238.307 49.023C238.563 49.131 238.797 49.2165 239.018 49.3245C239.606 49.5842 240.104 50.012 240.45 50.554C240.796 51.096 240.974 51.7282 240.962 52.371C241 53.0095 240.909 53.6491 240.696 54.252C240.549 54.651 240.323 55.0161 240.032 55.3255C239.74 55.6348 239.389 55.882 239 56.052C238.088 56.4372 237.109 56.6376 236.12 56.6415C235.886 56.6415 235.8 56.7045 235.805 56.9565C235.805 57.555 235.805 58.1535 235.805 58.7565C235.805 58.905 235.764 58.986 235.607 58.986H234.257V58.4235C234.257 57.915 234.257 57.4065 234.257 56.898C234.257 56.727 234.212 56.646 234.023 56.655C233.73 56.655 233.438 56.655 233.123 56.655V58.968H231.552V56.655H227.669V54.0225H228.816V45H227.678V42.39H231.543V39.8295H233.1V42.354H234.252L234.234 39.825ZM234.023 50.4405C233.766 50.4405 233.505 50.4405 233.249 50.4405C233.078 50.4405 233.024 50.499 233.024 50.6655C233.024 51.705 233.024 52.749 233.024 53.8155C233.024 54.018 233.1 54.063 233.285 54.063C233.735 54.063 234.185 54.063 234.635 54.063C235.046 54.0763 235.447 53.9356 235.76 53.6684C236.073 53.4012 236.275 53.0268 236.327 52.6185C236.397 52.3531 236.402 52.0747 236.342 51.8068C236.282 51.5389 236.159 51.2893 235.983 51.0789C235.806 50.8686 235.582 50.7037 235.329 50.5981C235.075 50.4924 234.8 50.4492 234.527 50.472L234.023 50.4405ZM233.024 46.611C233.024 47.061 233.024 47.511 233.024 47.961C233.024 48.1095 233.064 48.186 233.226 48.1815C233.699 48.1815 234.167 48.1815 234.639 48.1455C234.877 48.1368 235.105 48.0453 235.284 47.8868C235.462 47.7283 235.579 47.5127 235.616 47.277C235.68 46.9618 235.7 46.6392 235.674 46.3185C235.666 46.1469 235.624 45.9785 235.551 45.8232C235.477 45.6679 235.373 45.5286 235.246 45.4136C235.118 45.2985 234.969 45.2099 234.807 45.1528C234.645 45.0957 234.473 45.0713 234.302 45.081C233.951 45.081 233.6 45.081 233.249 45.081C233.078 45.081 233.019 45.1395 233.024 45.3015C233.028 45.7245 233.024 46.1655 233.024 46.611Z"
                          fill="black"
                        />
                      </g>
                      <path
                        d="M243.941 39.7665C245.245 41.0078 246.284 42.5003 246.996 44.154C247.71 45.8241 248.084 47.6196 248.096 49.4357C248.108 51.2518 247.759 53.0523 247.068 54.7319C246.378 56.4116 245.359 57.937 244.073 59.219C242.787 60.501 241.258 61.514 239.576 62.199C237.895 62.8914 236.092 63.2373 234.275 63.216C232.465 63.1926 230.677 62.8134 229.014 62.1C227.364 61.3787 225.873 60.3353 224.631 59.031C226.555 60.8908 228.981 62.1469 231.61 62.6443C234.24 63.1417 236.957 62.8586 239.427 61.83C242.709 60.4458 245.322 57.8373 246.713 54.558C247.746 52.0905 248.034 49.3744 247.541 46.7451C247.049 44.1157 245.797 41.6882 243.941 39.762V39.7665Z"
                        fill="white"
                      />
                      <path
                        opacity="0.1"
                        d="M224.55 59.013C223.253 57.7649 222.219 56.2701 221.508 54.6165C220.804 52.9498 220.434 51.1609 220.419 49.3515C220.408 47.5338 220.763 45.7325 221.463 44.055C222.157 42.373 223.18 40.8466 224.472 39.5653C225.764 38.2841 227.299 37.2739 228.987 36.594C230.669 35.9062 232.472 35.5649 234.288 35.5905C236.094 35.6199 237.877 36.0036 239.535 36.72C241.18 37.4458 242.664 38.4922 243.9 39.798C241.98 37.9363 239.559 36.6755 236.933 36.1703C234.307 35.6651 231.591 35.9374 229.118 36.954C227.488 37.6325 226.007 38.623 224.757 39.87C223.496 41.1069 222.493 42.5813 221.805 44.208C220.769 46.6734 220.476 49.3874 220.96 52.0172C221.445 54.6471 222.686 57.0784 224.532 59.013H224.55Z"
                        fill="black"
                      />
                      <path
                        d="M227.66 45C227.66 44.784 227.637 44.55 227.628 44.343C227.619 44.136 227.628 43.893 227.601 43.6905L227.57 42.381V42.3H227.664C228.956 42.3 230.243 42.3 231.53 42.3L231.44 42.39L231.471 41.1075L231.498 40.4685C231.498 40.257 231.498 40.0185 231.53 39.8295C231.53 40.041 231.53 40.257 231.561 40.4685L231.588 41.1075L231.62 42.39V42.4755H231.525C230.238 42.4965 228.95 42.4965 227.66 42.4755L227.754 42.3855L227.7 43.6995C227.7 43.9155 227.7 44.1495 227.673 44.352C227.646 44.5545 227.673 44.793 227.66 45Z"
                        fill="white"
                      />
                      <path
                        d="M227.651 56.664C227.651 56.214 227.619 55.764 227.606 55.35C227.592 54.936 227.606 54.45 227.579 54.0315V53.964H227.651H228.798L228.708 54.054V51.804C228.708 51.0525 228.708 50.301 228.708 49.554C228.708 48.807 228.708 48.051 228.74 47.304C228.771 46.557 228.776 45.801 228.803 45.054C228.833 45.807 228.855 46.557 228.87 47.304C228.87 48.06 228.897 48.8115 228.902 49.554C228.906 50.2965 228.902 51.057 228.902 51.804V54.054V54.1485H228.812H227.664L227.736 54.0765C227.736 54.5265 227.736 54.9765 227.709 55.395C227.682 55.8135 227.673 56.25 227.651 56.664Z"
                        fill="white"
                      />
                      <path
                        d="M233.285 54.0405C233.532 54.0135 233.784 54.0045 234.032 53.9865L234.783 53.955C235.017 53.9366 235.243 53.8666 235.446 53.7498C235.649 53.6331 235.824 53.4726 235.958 53.28C236.221 52.8827 236.325 52.4008 236.25 51.93C236.219 51.6892 236.141 51.4569 236.021 51.246C235.905 51.0283 235.742 50.8392 235.544 50.6925C235.769 50.8163 235.964 50.9887 236.114 51.1974C236.264 51.406 236.366 51.6455 236.412 51.8985C236.471 52.1553 236.477 52.4213 236.43 52.6804C236.382 52.9396 236.283 53.1864 236.138 53.406C235.986 53.6244 235.784 53.8036 235.549 53.9288C235.315 54.054 235.054 54.1216 234.788 54.126C234.284 54.1035 233.784 54.081 233.285 54.0405Z"
                        fill="white"
                      />
                      <path
                        d="M233.285 48.15C233.694 48.105 234.113 48.0825 234.513 48.06C234.702 48.0304 234.882 47.9573 235.038 47.8464C235.194 47.7355 235.323 47.5899 235.413 47.421C235.591 47.0712 235.649 46.673 235.58 46.287C235.518 45.8863 235.338 45.5133 235.062 45.216C235.403 45.4796 235.643 45.8526 235.741 46.2721C235.839 46.6917 235.79 47.1323 235.602 47.52C235.498 47.717 235.346 47.8851 235.161 48.0091C234.975 48.1332 234.762 48.2094 234.54 48.231C234.099 48.2355 233.699 48.1995 233.285 48.15Z"
                        fill="white"
                      />
                      <path
                        d="M231.534 56.664C231.61 57.0447 231.646 57.4323 231.642 57.8205C231.648 58.2088 231.612 58.5966 231.534 58.977C231.39 58.2127 231.39 57.4283 231.534 56.664Z"
                        fill="white"
                      />
                      <path
                        d="M234.18 56.7C234.256 57.0777 234.292 57.4623 234.288 57.8475C234.295 58.2328 234.258 58.6176 234.18 58.995C234.036 58.2368 234.036 57.4582 234.18 56.7Z"
                        fill="white"
                      />
                      <path
                        d="M210.622 194.787L210.595 194.337L211.041 194.31L211.077 194.756L210.622 194.787Z"
                        fill="#263238"
                      />
                      <path
                        d="M211.995 194.679L211.954 194.229C212.26 194.202 212.562 194.171 212.854 194.135L212.904 194.585C212.61 194.621 212.307 194.652 211.995 194.679ZM213.826 194.472L213.768 194.022L214.668 193.887L214.74 194.337L213.826 194.472ZM215.649 194.175L215.568 193.725L216.468 193.545L216.562 193.995C216.256 194.058 215.955 194.121 215.649 194.175ZM217.449 193.792L217.345 193.342L218.245 193.122L218.362 193.572C218.061 193.649 217.759 193.72 217.458 193.792H217.449ZM219.249 193.342L219.118 192.892C219.415 192.807 219.703 192.717 219.991 192.627L220.131 193.055C219.834 193.145 219.541 193.235 219.244 193.32L219.249 193.342ZM221.004 192.776L220.855 192.353L221.71 192.033L221.872 192.456L221.004 192.776ZM222.732 192.11L222.556 191.695L223.389 191.331L223.578 191.74L222.732 192.11ZM224.41 191.344L224.212 190.939C224.491 190.804 224.761 190.665 225.027 190.526L225.234 190.921C224.964 191.043 224.689 191.183 224.406 191.322L224.41 191.344ZM226.048 190.476L225.823 190.085C226.093 189.936 226.354 189.779 226.606 189.635L226.84 190.021C226.579 190.143 226.314 190.301 226.044 190.454L226.048 190.476ZM227.623 189.513L227.376 189.135C227.632 188.964 227.884 188.793 228.127 188.622L228.388 188.991C228.15 189.144 227.88 189.315 227.619 189.49L227.623 189.513ZM229.135 188.446L228.865 188.086C229.113 187.902 229.351 187.713 229.581 187.524L229.864 187.875C229.626 188.046 229.383 188.235 229.131 188.424L229.135 188.446ZM230.575 187.281L230.283 186.943C230.517 186.741 230.733 186.538 230.962 186.336L231.268 186.664C231.039 186.849 230.809 187.056 230.571 187.259L230.575 187.281ZM231.925 186.026L231.61 185.706C231.831 185.485 232.06 185.256 232.245 185.054L232.573 185.364C232.371 185.558 232.159 185.778 231.93 186.003L231.925 186.026ZM233.199 184.676L232.857 184.379C233.068 184.145 233.262 183.928 233.446 183.685L233.793 183.969C233.613 184.176 233.415 184.414 233.203 184.653L233.199 184.676ZM234.369 183.24L234.009 182.97C234.202 182.709 234.378 182.466 234.54 182.232L234.909 182.488C234.751 182.7 234.567 182.952 234.373 183.217L234.369 183.24Z"
                        fill="#263238"
                      />
                      <path
                        d="M235.431 181.683L235.049 181.444L235.283 181.066L235.67 181.296C235.598 181.418 235.517 181.548 235.431 181.683Z"
                        fill="#263238"
                      />
                      <path
                        d="M235.233 184.162L234.792 184.072L235.386 181.183L233.073 183.01L232.794 182.659L236.079 180.063L235.233 184.162Z"
                        fill="#263238"
                      />
                      <path
                        d="M147.695 172.143C147.573 171.868 147.515 171.693 147.515 171.693L147.938 171.535C147.938 171.535 147.992 171.679 148.109 171.936L147.695 172.143Z"
                        fill="#263238"
                      />
                      <path
                        d="M164.183 187.443L163.391 187.065L163.589 186.66L164.372 187.033L164.183 187.443ZM162.603 186.669C162.338 186.534 162.077 186.394 161.825 186.259L162.036 185.863L162.806 186.268L162.603 186.669ZM161.055 185.85C160.794 185.706 160.542 185.557 160.295 185.4L160.524 185.017C160.772 185.166 161.019 185.31 161.276 185.467L161.055 185.85ZM159.543 184.95C159.291 184.788 159.044 184.63 158.805 184.468L159.053 184.095L159.782 184.545L159.543 184.95ZM158.076 183.973C157.833 183.802 157.595 183.631 157.361 183.456L157.626 183.096C157.856 183.267 158.076 183.433 158.333 183.604L158.076 183.973ZM156.654 182.929L155.966 182.38L156.249 182.029C156.47 182.209 156.699 182.389 156.933 182.569L156.654 182.929ZM155.304 181.813C155.075 181.62 154.854 181.426 154.638 181.233L154.94 180.895C155.156 181.089 155.39 181.282 155.597 181.471L155.304 181.813ZM153.995 180.634C153.774 180.427 153.567 180.22 153.36 180.018L153.68 179.698L154.301 180.306L153.995 180.634ZM152.748 179.383C152.541 179.167 152.339 178.933 152.15 178.735L152.483 178.434C152.672 178.645 152.87 178.884 153.072 179.077L152.748 179.383ZM151.569 178.074C151.371 177.84 151.187 177.624 151.007 177.39L151.358 177.111C151.533 177.331 151.718 177.561 151.911 177.781L151.569 178.074ZM150.462 176.692C150.282 176.449 150.107 176.215 149.945 175.981L150.309 175.72C150.471 175.948 150.642 176.182 150.822 176.422L150.462 176.692ZM149.445 175.252C149.27 174.996 149.112 174.744 148.968 174.51L149.351 174.271C149.495 174.505 149.648 174.748 149.801 175.005L149.445 175.252ZM148.5 173.7C148.338 173.416 148.194 173.155 148.077 172.921L148.478 172.719C148.595 172.944 148.73 173.2 148.892 173.479L148.5 173.7Z"
                        fill="#263238"
                      />
                      <path
                        d="M165.411 187.983L164.993 187.803L165.173 187.393L165.587 187.569L165.411 187.983Z"
                        fill="#263238"
                      />
                      <path
                        d="M162.5 187.992L162.527 187.542L165.47 187.731L163.337 185.693L163.647 185.369L166.676 188.258L162.5 187.992Z"
                        fill="#263238"
                      />
                      <path
                        d="M211.617 188.608C210.615 191.685 208.723 194.396 206.181 196.398C203.639 198.401 200.561 199.605 197.335 199.859C194.109 200.112 190.88 199.404 188.056 197.824C185.232 196.244 182.94 193.862 181.469 190.98C179.998 188.098 179.415 184.844 179.792 181.63C180.169 178.416 181.49 175.386 183.588 172.923C185.686 170.459 188.468 168.673 191.581 167.789C194.693 166.906 197.998 166.964 201.078 167.958C203.127 168.62 205.026 169.679 206.665 171.076C208.305 172.473 209.652 174.179 210.631 176.097C211.61 178.015 212.201 180.108 212.37 182.255C212.539 184.401 212.284 186.561 211.617 188.608Z"
                        fill="#00FFB2"
                      />
                      <path
                        opacity="0.1"
                        d="M211.617 188.608C210.615 191.685 208.723 194.396 206.181 196.398C203.639 198.401 200.561 199.605 197.335 199.859C194.109 200.112 190.88 199.404 188.056 197.824C185.232 196.244 182.94 193.862 181.469 190.98C179.998 188.098 179.415 184.844 179.792 181.63C180.169 178.416 181.49 175.386 183.588 172.923C185.686 170.459 188.468 168.673 191.581 167.789C194.693 166.906 197.998 166.964 201.078 167.958C203.127 168.62 205.026 169.679 206.665 171.076C208.305 172.473 209.652 174.179 210.631 176.097C211.61 178.015 212.201 180.108 212.37 182.255C212.539 184.401 212.284 186.561 211.617 188.608Z"
                        fill="black"
                      />
                      <g opacity="0.1">
                        <path
                          d="M191.399 198C188.534 197.079 186.007 195.329 184.138 192.971C182.27 190.613 181.142 187.753 180.9 184.754C180.657 181.755 181.31 178.751 182.776 176.123C184.242 173.496 186.455 171.362 189.134 169.993C191.813 168.624 194.838 168.08 197.827 168.432C200.815 168.783 203.632 170.013 205.92 171.967C208.209 173.92 209.866 176.509 210.682 179.405C211.499 182.301 211.437 185.374 210.506 188.235C209.261 192.06 206.552 195.236 202.97 197.066C199.388 198.896 195.227 199.232 191.399 198ZM208.949 187.983C209.829 185.438 209.936 182.689 209.257 180.083C208.578 177.477 207.143 175.13 205.133 173.338C203.122 171.546 200.627 170.389 197.96 170.013C195.293 169.636 192.575 170.058 190.147 171.224C187.719 172.39 185.691 174.248 184.318 176.565C182.944 178.882 182.287 181.553 182.429 184.242C182.571 186.932 183.506 189.519 185.116 191.678C186.725 193.837 188.938 195.472 191.475 196.376C193.172 196.978 194.971 197.239 196.769 197.144C198.567 197.049 200.329 196.599 201.953 195.82C203.576 195.041 205.03 193.949 206.23 192.606C207.429 191.264 208.352 189.697 208.944 187.996L208.949 187.983Z"
                          fill="black"
                        />
                        <path
                          d="M198.923 174.402L200.412 174.879L200.273 175.306C200.088 175.887 199.908 176.472 199.71 177.048C199.634 177.264 199.71 177.34 199.895 177.439C200.492 177.704 201.067 178.017 201.614 178.375C202.964 179.356 203.337 180.738 202.712 182.295C202.599 182.578 202.47 182.855 202.325 183.123C202.142 183.446 201.886 183.722 201.579 183.93C201.271 184.137 200.919 184.271 200.552 184.32L199.971 184.41C200.183 184.594 200.381 184.743 200.556 184.914C201.033 185.343 201.373 185.903 201.533 186.524C201.693 187.145 201.667 187.8 201.456 188.406C201.299 189.027 201.019 189.61 200.633 190.12C200.37 190.453 200.043 190.73 199.671 190.933C199.299 191.136 198.89 191.262 198.468 191.304C197.482 191.394 196.488 191.287 195.543 190.989C195.318 190.926 195.219 190.948 195.152 191.187C194.981 191.763 194.774 192.33 194.589 192.901C194.544 193.041 194.481 193.108 194.333 193.063L193.055 192.649C193.118 192.46 193.172 192.285 193.226 192.114C193.383 191.632 193.532 191.146 193.676 190.665C193.734 190.498 193.712 190.408 193.532 190.359C193.248 190.282 192.974 190.183 192.663 190.084C192.425 190.836 192.213 191.551 191.957 192.285L190.463 191.808C190.697 191.074 190.913 190.359 191.169 189.607L187.47 188.419C187.745 187.573 188.006 186.759 188.276 185.917L189.369 186.264L192.15 177.673L191.066 177.327C191.336 176.49 191.597 175.675 191.867 174.829L195.548 176.013L196.331 173.574L197.811 174.051C197.559 174.843 197.303 175.635 197.042 176.454L198.135 176.805C198.405 176.008 198.657 175.221 198.923 174.402ZM195.476 184.441C195.228 184.365 194.981 184.293 194.738 184.203C194.58 184.144 194.508 184.203 194.459 184.347C194.144 185.341 193.829 186.336 193.5 187.326C193.437 187.519 193.5 187.591 193.676 187.641C194.126 187.771 194.535 187.92 194.967 188.05C195.355 188.189 195.78 188.177 196.16 188.018C196.539 187.859 196.846 187.564 197.019 187.191C197.166 186.961 197.255 186.699 197.28 186.427C197.305 186.155 197.265 185.882 197.163 185.629C197.061 185.376 196.9 185.151 196.693 184.972C196.487 184.794 196.24 184.667 195.975 184.603L195.476 184.441ZM195.696 180.49C195.561 180.913 195.431 181.336 195.291 181.755C195.242 181.894 195.264 181.98 195.417 182.025C195.867 182.155 196.317 182.313 196.767 182.425C196.997 182.491 197.242 182.474 197.46 182.378C197.679 182.282 197.857 182.112 197.964 181.899C198.121 181.616 198.237 181.314 198.311 180.999C198.355 180.833 198.367 180.66 198.344 180.49C198.321 180.32 198.265 180.156 198.178 180.008C198.091 179.859 197.976 179.73 197.839 179.627C197.702 179.523 197.545 179.448 197.379 179.406C197.046 179.293 196.709 179.199 196.38 179.077C196.218 179.023 196.146 179.077 196.097 179.226C195.975 179.649 195.836 180.067 195.696 180.49Z"
                          fill="black"
                        />
                      </g>
                      <path
                        d="M208.184 177.3C209.043 178.882 209.577 180.62 209.754 182.412C209.92 184.215 209.731 186.033 209.196 187.762C208.655 189.497 207.772 191.105 206.6 192.492C205.427 193.888 203.987 195.035 202.364 195.865C200.741 196.695 198.968 197.191 197.15 197.325C195.339 197.471 193.518 197.251 191.795 196.677C190.078 196.1 188.491 195.192 187.124 194.004C185.773 192.814 184.673 191.367 183.888 189.747C185.149 192.108 187.074 194.048 189.425 195.328C191.776 196.607 194.451 197.17 197.118 196.947C200.666 196.627 203.951 194.945 206.285 192.253C208.018 190.217 209.12 187.718 209.454 185.064C209.788 182.41 209.34 179.717 208.166 177.313L208.184 177.3Z"
                        fill="white"
                      />
                      <path
                        opacity="0.1"
                        d="M183.825 189.706C182.972 188.122 182.444 186.382 182.273 184.59C182.112 182.786 182.308 180.968 182.849 179.239C183.392 177.506 184.28 175.901 185.459 174.519C186.633 173.127 188.074 171.985 189.697 171.16C191.32 170.334 193.092 169.842 194.909 169.713C196.72 169.575 198.541 169.801 200.264 170.379C201.979 170.964 203.561 171.881 204.921 173.079C206.27 174.271 207.365 175.722 208.143 177.345C206.889 174.979 204.969 173.032 202.622 171.745C200.274 170.457 197.6 169.886 194.931 170.1C191.383 170.407 188.093 172.08 185.756 174.766C184.013 176.797 182.902 179.292 182.559 181.946C182.216 184.599 182.656 187.295 183.825 189.702V189.706Z"
                        fill="black"
                      />
                      <path
                        d="M191.079 177.327C191.133 177.115 191.192 176.904 191.25 176.692C191.309 176.481 191.363 176.269 191.426 176.062L191.795 174.802L191.817 174.717L191.907 174.744C193.14 175.117 194.369 175.509 195.588 175.927L195.476 175.986L195.899 174.775L196.119 174.177C196.191 173.974 196.263 173.776 196.344 173.574C196.29 173.781 196.236 173.988 196.178 174.195L196.007 174.811L195.647 176.04V176.125L195.557 176.098C194.324 175.726 193.097 175.333 191.876 174.919L191.988 174.856L191.538 176.094C191.471 176.301 191.39 176.508 191.313 176.71C191.237 176.913 191.16 177.12 191.079 177.327Z"
                        fill="white"
                      />
                      <path
                        d="M187.506 188.419C187.623 187.996 187.749 187.578 187.866 187.155C187.983 186.732 188.118 186.313 188.244 185.895V185.827H188.316L189.414 186.16L189.297 186.219L189.977 184.068C190.202 183.352 190.427 182.637 190.674 181.921C190.922 181.206 191.151 180.495 191.394 179.784C191.637 179.073 191.889 178.362 192.146 177.655C191.943 178.38 191.736 179.104 191.516 179.824C191.295 180.544 191.088 181.264 190.859 181.98C190.629 182.695 190.409 183.415 190.175 184.131L189.491 186.3L189.464 186.385L189.378 186.358L188.289 185.989L188.379 185.94C188.235 186.358 188.1 186.772 187.952 187.186C187.803 187.6 187.65 188.01 187.506 188.419Z"
                        fill="white"
                      />
                      <path
                        d="M193.676 187.65C193.919 187.704 194.162 187.771 194.405 187.83L195.125 188.028C195.353 188.083 195.591 188.086 195.82 188.037C196.05 187.988 196.266 187.888 196.452 187.744C196.728 187.516 196.937 187.217 197.057 186.88C197.177 186.543 197.205 186.179 197.136 185.827C197.089 185.584 196.993 185.353 196.853 185.148C197.028 185.336 197.159 185.561 197.236 185.806C197.314 186.051 197.337 186.311 197.303 186.565C197.279 186.828 197.203 187.083 197.079 187.315C196.954 187.547 196.784 187.751 196.578 187.915C196.366 188.077 196.119 188.186 195.857 188.232C195.594 188.278 195.325 188.261 195.071 188.181C194.603 188.01 194.135 187.839 193.676 187.65Z"
                        fill="white"
                      />
                      <path
                        d="M195.471 182.043C195.872 182.128 196.281 182.232 196.668 182.335C196.856 182.362 197.047 182.345 197.228 182.286C197.408 182.226 197.572 182.126 197.708 181.993C197.983 181.715 198.16 181.355 198.212 180.967C198.275 180.567 198.218 180.157 198.05 179.788C198.298 180.135 198.413 180.56 198.374 180.985C198.349 181.424 198.165 181.839 197.856 182.151C197.696 182.306 197.5 182.418 197.285 182.479C197.071 182.539 196.845 182.546 196.628 182.497C196.227 182.362 195.854 182.209 195.471 182.043Z"
                        fill="white"
                      />
                      <path
                        d="M191.205 189.607C191.107 190.378 190.868 191.124 190.499 191.808C190.541 191.422 190.626 191.042 190.751 190.674C190.865 190.304 191.017 189.947 191.205 189.607Z"
                        fill="white"
                      />
                      <path
                        d="M193.716 190.444C193.623 191.211 193.385 191.954 193.014 192.631C193.057 192.249 193.14 191.872 193.262 191.506C193.376 191.138 193.529 190.782 193.716 190.444Z"
                        fill="white"
                      />
                      <path
                        d="M202.864 187.011C203.378 190.206 202.933 193.481 201.586 196.422C200.239 199.364 198.05 201.841 195.297 203.54C192.543 205.239 189.348 206.084 186.114 205.968C182.881 205.852 179.754 204.781 177.129 202.889C174.504 200.997 172.499 198.37 171.366 195.34C170.233 192.309 170.024 189.01 170.764 185.861C171.505 182.711 173.162 179.852 175.527 177.643C177.891 175.435 180.857 173.976 184.05 173.453C186.176 173.104 188.35 173.179 190.447 173.672C192.544 174.166 194.523 175.068 196.271 176.327C198.019 177.587 199.501 179.179 200.632 181.012C201.764 182.846 202.522 184.884 202.864 187.011Z"
                        fill="#00FFB2"
                      />
                      <g opacity="0.1">
                        <path
                          d="M189.166 204.611C186.197 205.099 183.15 204.695 180.411 203.45C177.672 202.206 175.363 200.176 173.778 197.618C172.193 195.061 171.403 192.09 171.508 189.083C171.612 186.076 172.607 183.168 174.365 180.726C176.124 178.285 178.568 176.42 181.387 175.369C184.206 174.317 187.274 174.126 190.202 174.819C193.13 175.512 195.786 177.059 197.834 179.263C199.883 181.467 201.231 184.229 201.708 187.2C202.347 191.171 201.386 195.233 199.035 198.497C196.684 201.76 193.135 203.959 189.166 204.611ZM200.205 187.686C199.825 185.019 198.664 182.525 196.869 180.517C195.074 178.509 192.724 177.077 190.117 176.402C187.509 175.727 184.76 175.839 182.216 176.724C179.672 177.608 177.447 179.226 175.821 181.373C174.195 183.52 173.24 186.101 173.078 188.79C172.916 191.478 173.553 194.155 174.91 196.482C176.266 198.809 178.281 200.682 180.7 201.866C183.12 203.05 185.835 203.491 188.505 203.135C190.29 202.895 192.011 202.304 193.567 201.396C195.123 200.489 196.484 199.282 197.571 197.846C198.659 196.41 199.451 194.773 199.903 193.029C200.355 191.285 200.458 189.47 200.205 187.686Z"
                          fill="black"
                        />
                        <path
                          d="M185.08 180.167L186.624 179.91L186.696 180.36C186.795 180.963 186.903 181.562 186.988 182.16C187.024 182.385 187.11 182.421 187.335 182.421C187.988 182.381 188.643 182.398 189.292 182.471C190.948 182.723 191.902 183.785 192.055 185.454C192.085 185.753 192.097 186.054 192.091 186.354C192.076 186.725 191.974 187.088 191.794 187.414C191.615 187.739 191.362 188.019 191.056 188.231C190.912 188.343 190.764 188.447 190.584 188.577C190.858 188.64 191.101 188.685 191.335 188.757C191.959 188.919 192.521 189.261 192.95 189.742C193.38 190.222 193.657 190.819 193.747 191.457C193.891 192.08 193.906 192.726 193.792 193.356C193.714 193.773 193.552 194.17 193.314 194.521C193.076 194.872 192.769 195.171 192.411 195.399C191.576 195.93 190.642 196.288 189.666 196.452C189.436 196.497 189.36 196.565 189.405 196.812C189.517 197.402 189.589 198 189.688 198.59C189.711 198.738 189.688 198.828 189.531 198.851L188.208 199.071C188.176 198.873 188.145 198.693 188.118 198.513C188.032 198.014 187.947 197.514 187.87 197.01C187.848 196.839 187.79 196.767 187.601 196.808C187.317 196.866 187.025 196.907 186.701 196.956C186.831 197.735 186.952 198.477 187.078 199.238L185.53 199.494C185.404 198.734 185.283 197.991 185.152 197.213L181.35 197.852C181.201 196.974 181.066 196.128 180.922 195.255L182.052 195.066L180.585 186.165L179.46 186.35C179.32 185.481 179.181 184.64 179.037 183.762L182.848 183.137C182.709 182.277 182.569 181.454 182.434 180.608L183.969 180.356L184.378 182.844L185.512 182.66C185.355 181.832 185.22 181.017 185.08 180.167ZM186.602 190.674C186.345 190.715 186.093 190.764 185.836 190.8C185.665 190.8 185.625 190.89 185.652 191.057C185.823 192.083 185.998 193.113 186.16 194.144C186.192 194.342 186.277 194.378 186.457 194.342C186.907 194.261 187.357 194.198 187.807 194.117C188.215 194.062 188.587 193.857 188.852 193.543C189.117 193.228 189.254 192.826 189.238 192.416C189.264 192.144 189.224 191.871 189.123 191.618C189.021 191.365 188.861 191.139 188.655 190.961C188.449 190.782 188.204 190.655 187.939 190.591C187.674 190.526 187.398 190.525 187.132 190.589L186.602 190.674ZM184.995 187.074C185.067 187.524 185.139 187.947 185.206 188.388C185.229 188.532 185.287 188.6 185.445 188.568C185.895 188.478 186.372 188.415 186.831 188.307C187.065 188.26 187.276 188.132 187.426 187.947C187.576 187.761 187.657 187.529 187.654 187.29C187.667 186.967 187.634 186.645 187.555 186.332C187.519 186.164 187.45 186.005 187.352 185.863C187.254 185.722 187.129 185.602 186.984 185.51C186.84 185.417 186.678 185.354 186.509 185.325C186.339 185.295 186.166 185.299 185.998 185.337C185.652 185.391 185.305 185.459 184.959 185.504C184.788 185.531 184.743 185.603 184.774 185.765C184.851 186.183 184.918 186.62 184.995 187.056V187.074Z"
                          fill="black"
                        />
                      </g>
                      <path
                        d="M194.652 178.524C196.137 179.541 197.404 180.844 198.378 182.358C199.351 183.884 200.013 185.588 200.326 187.371C200.639 189.163 200.587 191 200.173 192.771C199.769 194.545 199.013 196.22 197.951 197.698C196.889 199.175 195.543 200.426 193.99 201.375C192.446 202.332 190.724 202.967 188.928 203.242C187.138 203.513 185.313 203.431 183.555 202.999C181.811 202.563 180.172 201.781 178.735 200.7C180.936 202.219 183.533 203.062 186.206 203.125C188.88 203.189 191.513 202.469 193.783 201.055C196.803 199.151 198.961 196.146 199.8 192.676C200.412 190.073 200.251 187.347 199.337 184.834C198.424 182.32 196.797 180.127 194.656 178.524H194.652Z"
                        fill="white"
                      />
                      <path
                        opacity="0.1"
                        d="M178.65 200.673C177.166 199.654 175.902 198.347 174.933 196.83C173.966 195.301 173.31 193.596 173.002 191.812C172.695 190.02 172.751 188.183 173.169 186.412C173.579 184.64 174.34 182.967 175.407 181.492C176.473 180.018 177.824 178.771 179.379 177.826C180.927 176.877 182.65 176.248 184.446 175.977C186.231 175.7 188.053 175.786 189.803 176.23C191.554 176.673 193.197 177.466 194.634 178.56C192.438 177.033 189.843 176.182 187.17 176.111C184.496 176.04 181.86 176.752 179.586 178.159C176.569 180.053 174.405 183.044 173.551 186.502C172.926 189.104 173.075 191.832 173.981 194.35C174.887 196.868 176.51 199.066 178.65 200.673Z"
                        fill="black"
                      />
                      <path
                        d="M179.437 186.35C179.388 186.138 179.343 185.922 179.302 185.706C179.262 185.49 179.208 185.279 179.167 185.067L178.924 183.78V183.69H179.014C180.283 183.461 181.552 183.24 182.83 183.065L182.754 183.168L182.578 181.899L182.502 181.265C182.475 181.053 182.448 180.842 182.43 180.626L182.565 181.256L182.691 181.881L182.934 183.137V183.227H182.839C181.575 183.461 180.301 183.677 179.028 183.857L179.104 183.753L179.284 185.054C179.316 185.27 179.338 185.504 179.365 185.702C179.392 185.9 179.415 186.134 179.437 186.35Z"
                        fill="white"
                      />
                      <path
                        d="M181.35 197.852C181.256 197.402 181.175 196.992 181.089 196.56C181.004 196.128 180.932 195.696 180.851 195.268V195.196H180.923L182.052 194.99L181.976 195.097L181.593 192.874C181.467 192.132 181.359 191.39 181.238 190.647C181.116 189.905 181.008 189.158 180.9 188.397C180.792 187.637 180.693 186.908 180.599 186.147C180.747 186.885 180.896 187.623 181.049 188.361C181.202 189.099 181.323 189.841 181.445 190.584C181.566 191.326 181.706 192.064 181.823 192.807L182.174 195.035V195.129H182.084L180.95 195.295L181.008 195.21C181.071 195.66 181.139 196.079 181.197 196.515C181.256 196.952 181.274 197.415 181.35 197.852Z"
                        fill="white"
                      />
                      <path
                        d="M186.458 194.342C186.701 194.279 186.944 194.229 187.187 194.17L187.92 194.018C188.148 193.96 188.36 193.853 188.542 193.705C188.724 193.556 188.871 193.37 188.973 193.158C189.167 192.72 189.19 192.226 189.036 191.772C188.968 191.541 188.855 191.325 188.703 191.138C188.55 190.943 188.359 190.782 188.141 190.665C188.383 190.752 188.603 190.891 188.785 191.073C188.967 191.255 189.107 191.476 189.194 191.718C189.293 191.962 189.342 192.224 189.337 192.488C189.332 192.752 189.274 193.012 189.167 193.253C189.053 193.494 188.882 193.704 188.67 193.865C188.458 194.026 188.21 194.134 187.947 194.18C187.452 194.247 186.957 194.306 186.458 194.342Z"
                        fill="white"
                      />
                      <path
                        d="M185.499 188.55C185.895 188.442 186.309 188.347 186.696 188.262C186.877 188.201 187.041 188.1 187.175 187.964C187.31 187.829 187.411 187.665 187.47 187.484C187.587 187.11 187.579 186.709 187.448 186.341C187.321 185.956 187.083 185.618 186.764 185.368C187.141 185.559 187.438 185.878 187.601 186.268C187.779 186.67 187.805 187.123 187.673 187.542C187.601 187.754 187.478 187.944 187.315 188.096C187.151 188.249 186.953 188.358 186.737 188.415C186.3 188.483 185.918 188.514 185.499 188.55Z"
                        fill="white"
                      />
                      <path
                        d="M185.157 197.217C185.295 197.581 185.394 197.958 185.454 198.342C185.522 198.724 185.549 199.111 185.535 199.498C185.396 199.137 185.298 198.761 185.242 198.378C185.173 197.995 185.145 197.606 185.157 197.217Z"
                        fill="white"
                      />
                      <path
                        d="M187.776 196.821C188.038 197.541 188.165 198.304 188.15 199.071C187.881 198.352 187.755 197.588 187.776 196.821Z"
                        fill="white"
                      />
                      <path
                        d="M295.785 85.203H243.936C242.532 85.2161 241.191 85.786 240.207 86.7877C239.223 87.7893 238.677 89.1405 238.689 90.5445V197.285C238.678 198.688 239.225 200.039 240.208 201.04C241.192 202.041 242.532 202.612 243.936 202.626H295.785C296.482 202.621 297.17 202.479 297.812 202.208C298.454 201.937 299.036 201.542 299.525 201.046C300.013 200.55 300.4 199.963 300.662 199.317C300.923 198.672 301.055 197.981 301.05 197.285V90.5445C301.056 89.8478 300.924 89.1568 300.663 88.5111C300.401 87.8653 300.015 87.2775 299.526 86.7813C299.037 86.2851 298.455 85.8903 297.813 85.6195C297.171 85.3487 296.482 85.2071 295.785 85.203ZM297.756 193.982C297.756 196.794 295.655 199.067 293.058 199.067H246.672C244.071 199.067 241.965 196.794 241.965 193.982V94.59C241.965 88.866 244.071 88.587 246.672 88.587H255.96C256.5 88.587 256.946 89.199 256.946 89.937V90.2655C256.946 92.0655 257.918 92.0655 259.119 92.0655H280.607C281.813 92.0655 282.78 92.0655 282.78 90.2655V89.937C282.78 89.1765 283.23 88.587 283.766 88.587H293.058C295.655 88.587 297.756 89.3475 297.756 94.59V193.982Z"
                        fill="#263238"
                      />
                      <path
                        d="M272.795 89.8515H266.945C266.849 89.8515 266.757 89.8136 266.69 89.7461C266.622 89.6786 266.585 89.587 266.585 89.4915C266.584 89.4439 266.593 89.3966 266.611 89.3524C266.628 89.3082 266.655 89.2679 266.688 89.234C266.722 89.2001 266.762 89.1732 266.806 89.1548C266.85 89.1365 266.897 89.127 266.945 89.127H272.795C272.842 89.127 272.889 89.1365 272.933 89.1548C272.977 89.1732 273.017 89.2001 273.051 89.234C273.084 89.2679 273.111 89.3082 273.128 89.3524C273.146 89.3966 273.155 89.4439 273.155 89.4915C273.155 89.587 273.117 89.6786 273.049 89.7461C272.982 89.8136 272.89 89.8515 272.795 89.8515Z"
                        fill="#455A64"
                      />
                      <path
                        d="M297.76 94.59V193.982C297.76 196.794 295.654 199.067 293.058 199.067H246.672C244.071 199.067 241.969 196.794 241.969 193.982V94.59C241.969 88.866 244.071 88.587 246.672 88.587H255.964C256.504 88.587 256.945 89.199 256.945 89.937V90.2655C256.945 92.0655 257.917 92.0655 259.119 92.0655H280.606C281.817 92.0655 282.78 92.0655 282.78 90.2655V89.937C282.78 89.1765 283.23 88.587 283.765 88.587H293.058C295.65 88.587 297.76 89.3475 297.76 94.59Z"
                        fill="white"
                      />
                      <path
                        d="M297.76 94.59V100.391H241.96V94.59C241.96 88.866 244.062 88.587 246.663 88.587H255.955C256.495 88.587 256.936 89.199 256.936 89.937V90.2655C256.936 92.0655 257.908 92.0655 259.11 92.0655H280.597C281.808 92.0655 282.771 92.0655 282.771 90.2655V89.937C282.771 89.1765 283.221 88.587 283.756 88.587H293.049C295.65 88.587 297.76 89.3475 297.76 94.59Z"
                        fill="#00FFB2"
                      />
                      <path
                        d="M254.358 90.819L254.268 90.909C254.254 90.9277 254.237 90.9444 254.218 90.9585C253.988 90.7296 253.677 90.6011 253.352 90.6011C253.028 90.6011 252.716 90.7296 252.486 90.9585L252.45 90.9L252.36 90.8145C252.395 90.7777 252.433 90.7432 252.472 90.711C252.553 90.6457 252.64 90.5898 252.733 90.5445C252.845 90.4902 252.963 90.4508 253.084 90.4275H253.255H253.408H253.53C253.719 90.4491 253.902 90.5104 254.066 90.6075C254.138 90.6488 254.205 90.697 254.268 90.7515L254.362 90.837L254.358 90.819Z"
                        fill="white"
                      />
                      <path
                        d="M252.774 91.242L252.63 91.1025C252.787 90.9447 252.99 90.842 253.21 90.81C253.367 90.7872 253.527 90.8014 253.677 90.8514C253.827 90.9014 253.963 90.9859 254.074 91.098L253.935 91.242C253.781 91.0887 253.572 91.0026 253.354 91.0026C253.137 91.0026 252.928 91.0887 252.774 91.242Z"
                        fill="white"
                      />
                      <path
                        d="M253.8 91.386L253.66 91.5255C253.622 91.4855 253.576 91.4537 253.525 91.432C253.474 91.4104 253.419 91.3993 253.364 91.3995C253.252 91.4034 253.147 91.4483 253.066 91.5255L252.922 91.386C252.98 91.3274 253.048 91.2808 253.123 91.2489C253.198 91.2171 253.279 91.2007 253.361 91.2007C253.443 91.2007 253.524 91.2171 253.599 91.2489C253.675 91.2808 253.743 91.3274 253.8 91.386Z"
                        fill="white"
                      />
                      <path
                        d="M253.481 91.6515C253.481 91.6854 253.467 91.7179 253.444 91.7422C253.42 91.7666 253.388 91.7808 253.355 91.782C253.325 91.7764 253.298 91.7605 253.278 91.7371C253.259 91.7137 253.248 91.6842 253.248 91.6538C253.248 91.6233 253.259 91.5939 253.278 91.5705C253.298 91.547 253.325 91.5311 253.355 91.5255C253.388 91.5266 253.419 91.5403 253.442 91.5637C253.466 91.5871 253.479 91.6185 253.481 91.6515Z"
                        fill="white"
                      />
                      <path
                        d="M245.605 91.0935C245.605 91.0205 245.627 90.9492 245.668 90.8885C245.708 90.8278 245.766 90.7805 245.833 90.7526C245.901 90.7247 245.975 90.7174 246.046 90.7316C246.118 90.7458 246.184 90.781 246.235 90.8326C246.287 90.8842 246.322 90.9499 246.336 91.0215C246.351 91.0931 246.343 91.1673 246.315 91.2347C246.287 91.3022 246.24 91.3598 246.179 91.4003C246.119 91.4409 246.047 91.4625 245.974 91.4625C245.877 91.4613 245.784 91.4221 245.715 91.3531C245.646 91.2842 245.607 91.191 245.605 91.0935Z"
                        fill="white"
                      />
                      <path
                        d="M246.771 91.0935C246.771 91.0205 246.793 90.9492 246.833 90.8885C246.874 90.8278 246.931 90.7805 246.999 90.7526C247.066 90.7247 247.14 90.7174 247.212 90.7316C247.284 90.7458 247.349 90.781 247.401 90.8326C247.453 90.8842 247.488 90.9499 247.502 91.0215C247.516 91.0931 247.509 91.1673 247.481 91.2347C247.453 91.3022 247.406 91.3598 247.345 91.4003C247.284 91.4409 247.213 91.4625 247.14 91.4625C247.042 91.4625 246.948 91.4236 246.879 91.3544C246.81 91.2852 246.771 91.1914 246.771 91.0935Z"
                        fill="white"
                      />
                      <path
                        d="M247.95 91.0935C247.95 91.0205 247.972 90.9492 248.012 90.8885C248.053 90.8278 248.11 90.7805 248.178 90.7526C248.245 90.7247 248.319 90.7174 248.391 90.7316C248.463 90.7458 248.528 90.781 248.58 90.8326C248.631 90.8842 248.667 90.9499 248.681 91.0215C248.695 91.0931 248.688 91.1673 248.66 91.2347C248.632 91.3022 248.585 91.3598 248.524 91.4003C248.463 91.4409 248.392 91.4625 248.319 91.4625C248.221 91.4625 248.127 91.4236 248.058 91.3544C247.989 91.2852 247.95 91.1914 247.95 91.0935Z"
                        fill="white"
                      />
                      <path
                        d="M249.097 91.0935C249.097 91.0193 249.118 90.9464 249.159 90.8843C249.199 90.8222 249.257 90.7737 249.326 90.7448C249.394 90.716 249.47 90.7082 249.543 90.7225C249.616 90.7368 249.683 90.7724 249.735 90.8249C249.788 90.8774 249.823 90.9444 249.837 91.0173C249.852 91.0901 249.844 91.1656 249.815 91.234C249.786 91.3025 249.738 91.3608 249.676 91.4014C249.614 91.4421 249.541 91.4634 249.466 91.4625C249.369 91.4614 249.276 91.4221 249.207 91.3531C249.138 91.2842 249.099 91.191 249.097 91.0935Z"
                        fill="white"
                      />
                      <path
                        d="M250.263 91.0935C250.263 90.9956 250.302 90.9018 250.371 90.8326C250.44 90.7634 250.534 90.7245 250.632 90.7245C250.73 90.7245 250.824 90.7634 250.893 90.8326C250.962 90.9018 251.001 90.9956 251.001 91.0935C251.001 91.1914 250.962 91.2852 250.893 91.3544C250.824 91.4236 250.73 91.4625 250.632 91.4625C250.534 91.4625 250.44 91.4236 250.371 91.3544C250.302 91.2852 250.263 91.1914 250.263 91.0935Z"
                        fill="white"
                      />
                      <path
                        d="M293.576 91.899H290.561V90.504H293.576V91.899ZM290.718 91.7415H293.418V90.6615H290.718V91.7415Z"
                        fill="white"
                      />
                      <path
                        d="M292.752 90.7425H290.812V91.665H292.752V90.7425Z"
                        fill="white"
                      />
                      <path
                        d="M293.841 90.828H293.576V91.575H293.841V90.828Z"
                        fill="white"
                      />
                      <path
                        d="M293.625 199.026C293.437 199.053 293.248 199.067 293.058 199.067H273.983C273.983 198.99 273.947 198.914 273.933 198.837C273.92 198.761 273.884 198.621 273.861 198.513C273.839 198.405 273.812 198.27 273.785 198.153C271.031 185.333 268.632 170.159 267.8 166.437C266.79 163.926 265.936 161.354 265.244 158.738C265.203 158.598 265.167 158.454 265.127 158.31C264.839 157.199 264.555 156.015 264.303 154.782C263.984 153.234 263.714 151.632 263.529 149.958C263.529 149.958 278.991 149.958 284.121 149.958H285.75L285.782 150.017C286.539 151.553 287.191 153.139 287.735 154.764C289.085 158.72 290.318 164.403 288.572 168.984C288.333 169.605 291.398 190.431 293.625 199.026Z"
                        fill="#37474F"
                      />
                      <path
                        d="M279.144 199.067H278.626C278.428 197.811 278.239 196.556 278.037 195.305C277.299 190.688 276.562 186.069 275.827 181.449L275.8 181.278L275.679 180.531C275.638 180.27 275.593 180.005 275.553 179.739C275.256 177.939 274.963 176.166 274.743 174.371C274.554 172.854 274.32 171.347 274.086 169.835L273.991 169.249C273.883 168.574 273.78 167.9 273.676 167.216C273.591 166.635 273.505 166.05 273.429 165.465C273.429 165.344 273.591 165.29 273.613 165.416C273.852 166.694 274.063 167.981 274.275 169.263L274.369 169.853C274.504 170.694 274.639 171.54 274.779 172.382C274.977 173.565 275.229 174.735 275.431 175.919C275.539 176.562 275.643 177.206 275.746 177.845C275.787 178.11 275.832 178.376 275.872 178.637C275.913 178.898 275.958 179.15 275.998 179.406V179.478C276.745 184.131 277.488 188.781 278.226 193.428C278.532 195.312 278.838 197.192 279.144 199.067Z"
                        fill="#263238"
                      />
                      <path
                        d="M285.782 149.958V150.017C285.71 151.619 285.549 153.216 285.3 154.8C284.733 158.531 283.5 163.755 280.8 168.048C280.8 168.048 279.9 168.386 278.897 168.822C278.181 169.118 277.481 169.45 276.8 169.817H276.773C276.773 169.817 276.773 169.875 276.773 169.992C276.687 170.793 276.323 174.254 275.873 178.61C275.81 179.226 275.747 179.856 275.679 180.504C275.04 186.804 274.28 194.333 273.879 198.504C273.861 198.696 273.843 198.881 273.825 199.058H255.083C255.326 194.418 256.631 172.13 260.798 155.804C260.892 155.444 260.987 155.084 261.081 154.733C261.122 154.575 261.167 154.417 261.212 154.26C261.387 153.603 261.572 152.955 261.761 152.321C261.761 152.321 261.761 152.289 261.761 152.271L261.909 151.781C262.103 151.155 262.301 150.543 262.503 149.949L285.782 149.958Z"
                        fill="#37474F"
                      />
                      <path
                        d="M266.693 151.889C266.456 152.858 266.232 153.827 266.022 154.796C265.739 156.105 265.482 157.419 265.244 158.738C264.668 161.915 264.209 165.11 263.799 168.309C263.106 173.777 262.449 179.253 261.891 184.734C261.405 189.504 261.032 194.282 260.771 199.067H260.285C260.897 189.324 261.954 179.622 263.25 169.943C263.768 166.05 264.344 162.162 265.127 158.31C265.365 157.136 265.622 155.961 265.901 154.796C266.135 153.819 266.382 152.847 266.652 151.88L266.693 151.889Z"
                        fill="#263238"
                      />
                      <path
                        d="M261.162 154.287C261.162 154.277 261.166 154.268 261.172 154.262C261.179 154.255 261.188 154.251 261.198 154.251C261.207 154.251 261.217 154.255 261.223 154.262C261.23 154.268 261.234 154.277 261.234 154.287C261.144 155.61 260.919 157.055 261.508 158.301C262.026 159.404 263.016 160.025 263.925 160.767C263.952 160.767 263.925 160.835 263.889 160.826C262.678 160.461 261.472 159.791 261 158.553C260.464 157.176 260.752 155.664 261.162 154.287Z"
                        fill="#263238"
                      />
                      <path
                        d="M271.247 169.16C272.217 169.13 273.188 169.163 274.154 169.259C275.102 169.31 276.052 169.292 276.998 169.205C277.472 169.16 277.943 169.082 278.406 168.971C278.888 168.858 279.342 168.678 279.819 168.548C280.253 168.453 280.704 168.471 281.129 168.602C281.633 168.714 282.137 168.791 282.65 168.858C283.815 169.03 284.996 169.06 286.169 168.948C286.214 168.948 286.236 169.011 286.169 169.02C285.183 169.229 284.179 169.333 283.172 169.331C282.656 169.32 282.142 169.274 281.633 169.191C281.163 169.059 280.676 168.996 280.188 169.007C279.711 169.132 279.241 169.282 278.78 169.457C278.311 169.585 277.834 169.683 277.353 169.749C276.388 169.873 275.413 169.904 274.442 169.839C273.343 169.809 272.253 169.641 271.197 169.34C271.182 169.327 271.171 169.31 271.166 169.291C271.16 169.273 271.16 169.253 271.165 169.234C271.17 169.215 271.181 169.198 271.195 169.185C271.209 169.172 271.227 169.163 271.247 169.16Z"
                        fill="#263238"
                      />
                      <path
                        d="M276.75 169.61C276.75 169.686 276.75 169.758 276.75 169.835C276.75 169.911 276.75 169.956 276.75 170.019C276.701 171.9 276.498 173.781 276.341 175.658C276.233 176.933 276.122 178.206 276.008 179.478C275.945 180.135 275.886 180.792 275.823 181.449C275.823 181.535 275.823 181.616 275.801 181.701C275.423 185.751 275.063 189.76 274.59 193.779C274.455 194.922 274.316 196.061 274.167 197.204C274.095 197.748 274.01 198.292 273.929 198.837C273.929 198.913 273.929 198.99 273.893 199.066H273.717C273.74 198.765 273.762 198.459 273.78 198.166C273.866 196.974 273.942 195.781 274.05 194.593C274.235 192.582 274.437 190.566 274.644 188.555C274.955 185.621 275.247 182.705 275.544 179.753C275.607 179.118 275.67 178.488 275.738 177.858C275.783 177.408 275.828 176.958 275.877 176.477C276.102 174.272 276.269 172.048 276.62 169.857C276.62 169.776 276.62 169.699 276.656 169.618C276.658 169.608 276.663 169.598 276.671 169.591C276.679 169.584 276.689 169.58 276.699 169.579C276.71 169.578 276.721 169.58 276.73 169.586C276.739 169.591 276.746 169.6 276.75 169.61Z"
                        fill="#263238"
                      />
                      <path
                        d="M262.651 142.398L260.761 152.518C260.761 152.518 283.167 152.833 288.432 152.464C288.432 152.464 282.928 131.035 277.272 124.888C274.441 121.819 271.116 122.049 269.001 124.195C268.466 124.74 262.071 133.195 261.396 136.417C260.811 139.266 262.651 142.398 262.651 142.398Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M277.56 145.8C277.332 146.015 277.15 146.273 277.024 146.561C277.31 146.433 277.568 146.251 277.785 146.025C278.008 145.806 278.19 145.548 278.32 145.265C278.033 145.39 277.775 145.572 277.56 145.8ZM270.689 124.299C270.462 124.515 270.28 124.773 270.153 125.06C270.437 124.93 270.694 124.75 270.914 124.529C271.136 124.309 271.317 124.051 271.449 123.768C271.162 123.892 270.904 124.072 270.689 124.299ZM264.181 143.293C263.954 143.508 263.771 143.767 263.646 144.054C263.933 143.929 264.192 143.746 264.406 143.518C264.632 143.302 264.814 143.044 264.942 142.758C264.655 142.883 264.396 143.066 264.181 143.293ZM265.707 148.986C265.486 148.764 265.227 148.584 264.942 148.455C265.208 149.028 265.669 149.487 266.243 149.751C266.109 149.467 265.928 149.209 265.707 148.986ZM273.037 135C272.82 134.776 272.562 134.596 272.277 134.469C272.541 135.04 273.001 135.498 273.573 135.761C273.443 135.476 273.261 135.219 273.037 135ZM284.094 148.95C283.786 148.946 283.481 149.001 283.194 149.112C283.481 149.221 283.787 149.275 284.094 149.269C284.401 149.273 284.706 149.22 284.994 149.112C284.707 149.003 284.401 148.948 284.094 148.95ZM278.591 138.06C278.276 138.057 277.963 138.112 277.668 138.222C277.963 138.332 278.276 138.387 278.591 138.384C278.898 138.387 279.203 138.332 279.491 138.222C279.203 138.114 278.898 138.059 278.591 138.06ZM266.639 136.741C266.331 136.74 266.026 136.795 265.739 136.904C266.026 137.012 266.331 137.067 266.639 137.066C266.953 137.068 267.266 137.013 267.561 136.904C267.267 136.791 266.954 136.736 266.639 136.741ZM272.277 148.779C271.97 148.778 271.665 148.833 271.377 148.941C271.665 149.049 271.97 149.104 272.277 149.103C272.585 149.106 272.89 149.051 273.177 148.941C272.889 148.833 272.584 148.778 272.277 148.779ZM273.177 128.367C272.87 128.366 272.565 128.421 272.277 128.529C272.868 128.745 273.517 128.745 274.108 128.529C273.817 128.419 273.507 128.364 273.195 128.367H273.177ZM267.097 129.186C266.875 129.776 266.875 130.427 267.097 131.017C267.204 130.729 267.258 130.425 267.259 130.117C267.27 129.801 267.221 129.485 267.116 129.186H267.097ZM277.816 152.181C277.757 152.325 277.714 152.476 277.691 152.631H277.938C277.92 152.478 277.885 152.327 277.834 152.181H277.816ZM271.674 141.255C271.464 141.847 271.464 142.494 271.674 143.087C271.783 142.799 271.838 142.494 271.836 142.187C271.843 141.868 271.788 141.552 271.674 141.255ZM283.662 141.255C283.55 141.542 283.495 141.847 283.5 142.155C283.496 142.463 283.551 142.768 283.662 143.055C283.872 142.463 283.872 141.816 283.662 141.223V141.255ZM278.914 130.766C278.7 131.359 278.7 132.008 278.914 132.602C279.023 132.314 279.078 132.009 279.076 131.702C279.085 131.382 279.03 131.064 278.914 130.766Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M260.298 119.534C260.284 122.769 259.311 125.928 257.502 128.611C255.694 131.295 253.131 133.382 250.137 134.609C247.143 135.836 243.852 136.149 240.681 135.507C237.509 134.866 234.599 133.299 232.318 131.004C230.036 128.71 228.486 125.79 227.863 122.615C227.239 119.44 227.571 116.151 228.816 113.164C230.06 110.178 232.162 107.627 234.856 105.834C237.549 104.041 240.714 103.086 243.949 103.09C246.103 103.094 248.235 103.522 250.223 104.351C252.212 105.18 254.017 106.393 255.535 107.92C257.054 109.448 258.256 111.26 259.073 113.252C259.891 115.245 260.307 117.38 260.298 119.534Z"
                        fill="#00FFB2"
                      />
                      <g opacity="0.1">
                        <path
                          d="M243.949 104.261C240.35 104.253 236.866 105.523 234.116 107.846C231.367 110.168 229.531 113.392 228.937 116.941C228.814 117.675 228.744 118.416 228.731 119.16C228.731 119.214 228.731 119.272 228.731 119.331V119.462C228.728 120.841 228.914 122.214 229.284 123.543C229.311 123.642 229.338 123.741 229.369 123.84C230.079 126.208 231.356 128.367 233.089 130.13C234.822 131.892 236.959 133.206 239.315 133.956C241.67 134.706 244.173 134.87 246.606 134.434C249.039 133.998 251.33 132.975 253.278 131.454C253.364 131.387 253.453 131.319 253.534 131.247C253.966 130.896 254.377 130.522 254.768 130.127C254.862 130.032 254.957 129.933 255.047 129.834C257.066 127.67 258.411 124.963 258.914 122.046C259.417 119.129 259.058 116.128 257.88 113.413C256.702 110.697 254.757 108.384 252.283 106.758C249.809 105.132 246.914 104.264 243.954 104.261H243.949ZM252.049 108.517C252.581 108.916 253.083 109.352 253.553 109.823C253.594 109.861 253.633 109.901 253.67 109.944C256.19 112.524 257.584 115.997 257.547 119.604C257.51 123.21 256.044 126.654 253.472 129.182L253.201 129.434C252.843 129.773 252.465 130.09 252.068 130.383L251.86 130.536C251.53 130.776 251.193 130.996 250.848 131.197C248.619 132.516 246.061 133.176 243.472 133.101C240.689 133.022 238 132.078 235.778 130.401C235.412 130.131 235.062 129.842 234.729 129.533L234.562 129.38C233.646 128.515 232.851 127.529 232.2 126.45C232.188 126.433 232.177 126.415 232.168 126.396C231.87 125.894 231.605 125.372 231.376 124.835C231.345 124.772 231.318 124.708 231.291 124.645C230.66 123.127 230.314 121.506 230.269 119.862C230.269 119.763 230.269 119.659 230.269 119.556C230.269 119.452 230.269 119.263 230.269 119.106C230.29 118.268 230.389 117.433 230.566 116.613C231.038 114.394 232.055 112.327 233.527 110.599C234.998 108.872 236.877 107.539 238.994 106.721C241.11 105.903 243.397 105.626 245.648 105.914C247.898 106.203 250.041 107.048 251.883 108.374L252.049 108.517Z"
                          fill="black"
                        />
                        <path
                          d="M250.578 122.441C250.591 121.798 250.414 121.166 250.069 120.624C249.724 120.082 249.226 119.654 248.639 119.394C248.418 119.286 248.189 119.205 247.928 119.097L248.45 118.832C248.785 118.672 249.079 118.437 249.309 118.145C249.538 117.853 249.697 117.512 249.773 117.149C249.832 116.852 249.87 116.551 249.885 116.249C250.007 114.575 249.237 113.369 247.635 112.851C247.005 112.678 246.363 112.554 245.714 112.482C245.493 112.451 245.412 112.397 245.417 112.172C245.417 111.56 245.417 110.952 245.417 110.34V109.89H243.855V112.415H242.703V109.895H241.146V112.451H237.281V115.074H238.419V124.074H237.285V126.707H241.169V129.015H242.739V126.72C243.036 126.72 243.306 126.72 243.572 126.72H243.648C243.707 126.713 243.766 126.728 243.815 126.761C243.869 126.797 243.882 126.864 243.882 126.968V127.161C243.882 127.611 243.882 128.061 243.882 128.511V129.074H245.232C245.39 129.074 245.43 128.988 245.43 128.84C245.43 128.241 245.43 127.638 245.43 127.04C245.43 126.788 245.511 126.734 245.745 126.725C246.242 126.712 246.737 126.661 247.226 126.572C247.709 126.481 248.179 126.33 248.625 126.122C249.015 125.951 249.366 125.704 249.657 125.395C249.949 125.086 250.175 124.72 250.322 124.322C250.535 123.719 250.622 123.078 250.578 122.441ZM242.658 116.667C242.658 116.217 242.658 115.767 242.658 115.34C242.658 115.173 242.712 115.11 242.883 115.115C243.234 115.115 243.585 115.115 243.936 115.115C244.219 115.109 244.498 115.187 244.737 115.34C244.788 115.371 244.836 115.408 244.881 115.448C244.895 115.457 244.907 115.469 244.917 115.484C244.956 115.518 244.991 115.557 245.021 115.601C245.054 115.64 245.085 115.682 245.111 115.727C245.133 115.761 245.153 115.797 245.169 115.835C245.245 115.996 245.292 116.17 245.309 116.348C245.332 116.67 245.312 116.994 245.25 117.311C245.213 117.546 245.095 117.761 244.917 117.919C244.739 118.078 244.512 118.169 244.274 118.179C243.824 118.211 243.374 118.179 242.924 118.211H242.856C242.694 118.211 242.649 118.143 242.654 117.995C242.663 117.554 242.658 117.113 242.658 116.667ZM242.658 123.867V123.75C242.658 123.642 242.658 123.534 242.658 123.426C242.658 122.526 242.658 121.626 242.658 120.704C242.658 120.537 242.712 120.474 242.883 120.479C243.14 120.479 243.401 120.479 243.657 120.479H244.184C244.531 120.471 244.873 120.555 245.178 120.722L245.259 120.767C245.33 120.814 245.398 120.867 245.462 120.924C245.682 121.14 245.844 121.409 245.93 121.705C246.017 122.002 246.026 122.315 245.957 122.616C245.907 123.025 245.707 123.4 245.394 123.668C245.082 123.937 244.681 124.078 244.269 124.065C243.887 124.065 243.5 124.065 243.117 124.065H242.915C242.735 124.101 242.654 124.052 242.658 123.849V123.867Z"
                          fill="black"
                        />
                      </g>
                      <path
                        d="M253.575 109.823C254.876 111.067 255.915 112.558 256.63 114.21C257.345 115.88 257.72 117.676 257.733 119.492C257.746 121.309 257.397 123.109 256.706 124.789C256.015 126.469 254.997 127.995 253.71 129.277C252.422 130.559 250.893 131.571 249.21 132.255C247.526 132.948 245.721 133.296 243.9 133.277C242.09 133.254 240.303 132.874 238.639 132.161C236.989 131.441 235.499 130.399 234.256 129.096C236.182 130.953 238.608 132.208 241.236 132.705C243.865 133.202 246.582 132.921 249.052 131.895C251.508 130.871 253.609 129.148 255.093 126.939C256.577 124.731 257.379 122.136 257.4 119.475C257.429 115.882 256.057 112.42 253.575 109.823Z"
                        fill="white"
                      />
                      <path
                        opacity="0.1"
                        d="M234.171 129.074C232.874 127.824 231.84 126.327 231.129 124.673C230.424 123.006 230.054 121.217 230.04 119.408C230.029 117.591 230.384 115.791 231.084 114.116C231.779 112.433 232.802 110.907 234.094 109.625C235.386 108.343 236.921 107.332 238.608 106.65C240.287 105.964 242.087 105.624 243.9 105.651C245.711 105.676 247.499 106.06 249.161 106.781C250.808 107.504 252.294 108.551 253.53 109.859C251.612 107.994 249.191 106.732 246.564 106.226C243.937 105.721 241.22 105.995 238.748 107.015C235.464 108.394 232.843 110.993 231.435 114.264C230.4 116.73 230.106 119.445 230.591 122.075C231.075 124.706 232.316 127.138 234.162 129.074H234.171Z"
                        fill="black"
                      />
                      <path
                        d="M237.294 115.069C237.294 114.849 237.271 114.619 237.262 114.412C237.253 114.205 237.262 113.962 237.235 113.755L237.204 112.446V112.356H237.298C238.585 112.333 239.877 112.333 241.164 112.356L241.074 112.446L241.105 111.168L241.132 110.529C241.132 110.313 241.132 110.079 241.164 109.885C241.164 110.101 241.186 110.313 241.195 110.529L241.2 111.15L241.231 112.428V112.518H241.137C239.85 112.518 238.558 112.518 237.271 112.518L237.361 112.428L237.33 113.737C237.33 113.958 237.33 114.187 237.303 114.394C237.276 114.601 237.307 114.849 237.294 115.069Z"
                        fill="white"
                      />
                      <path
                        d="M237.285 126.724C237.285 126.274 237.254 125.847 237.24 125.406C237.227 124.965 237.24 124.528 237.213 124.092V124.02H237.285H238.432L238.343 124.11V121.86C238.343 121.104 238.343 120.352 238.343 119.61C238.343 118.867 238.342 118.107 238.374 117.36C238.405 116.613 238.41 115.857 238.437 115.11C238.467 115.86 238.49 116.61 238.505 117.36C238.505 118.111 238.532 118.863 238.532 119.61C238.532 120.357 238.532 121.113 238.532 121.86V124.11V124.2H238.442H237.294L237.366 124.128C237.366 124.578 237.366 125.005 237.339 125.442C237.312 125.878 237.303 126.283 237.285 126.724Z"
                        fill="white"
                      />
                      <path
                        d="M242.919 124.097C243.167 124.097 243.419 124.061 243.666 124.043L244.418 124.016C244.651 123.995 244.878 123.924 245.081 123.807C245.284 123.689 245.458 123.529 245.592 123.336C245.856 122.939 245.96 122.457 245.885 121.986C245.854 121.746 245.776 121.515 245.655 121.307C245.538 121.088 245.375 120.898 245.178 120.749C245.404 120.873 245.598 121.047 245.749 121.256C245.899 121.465 246.001 121.705 246.047 121.959C246.105 122.216 246.111 122.482 246.063 122.742C246.015 123.001 245.915 123.248 245.768 123.467C245.616 123.685 245.415 123.864 245.18 123.989C244.945 124.113 244.683 124.18 244.418 124.182C243.9 124.164 243.419 124.142 242.919 124.097Z"
                        fill="white"
                      />
                      <path
                        d="M242.919 118.215C243.329 118.175 243.747 118.148 244.148 118.13C244.337 118.099 244.517 118.025 244.673 117.914C244.829 117.802 244.957 117.656 245.048 117.486C245.226 117.136 245.283 116.738 245.21 116.352C245.149 115.952 244.97 115.579 244.697 115.281C245.038 115.545 245.278 115.919 245.376 116.339C245.474 116.76 245.425 117.201 245.237 117.59C245.131 117.786 244.98 117.953 244.794 118.076C244.609 118.199 244.396 118.275 244.175 118.296C243.734 118.292 243.333 118.256 242.919 118.215Z"
                        fill="white"
                      />
                      <path
                        d="M241.169 126.724C241.245 127.104 241.281 127.49 241.277 127.876C241.283 128.265 241.247 128.653 241.169 129.033C241.025 128.27 241.025 127.487 241.169 126.724Z"
                        fill="white"
                      />
                      <path
                        d="M243.815 126.756C243.958 127.514 243.958 128.293 243.815 129.051C243.671 128.293 243.671 127.514 243.815 126.756Z"
                        fill="white"
                      />
                      <path
                        d="M274.5 123.3C274.365 123.75 272.016 126.495 270 126.257C269.334 126.176 269.608 122.531 269.608 122.531L269.568 122.256L268.992 118.422L273.627 115.893L274.293 115.565C274.293 115.565 274.383 116.622 274.482 117.941C274.482 118.004 274.482 118.062 274.482 118.13C274.482 118.197 274.482 118.274 274.482 118.346C274.482 118.539 274.513 118.742 274.527 118.944C274.54 119.147 274.527 119.246 274.554 119.394C274.581 119.543 274.554 119.714 274.554 119.876C274.613 121.017 274.595 122.161 274.5 123.3Z"
                        fill="#F7A9A0"
                      />
                      <path
                        d="M274.455 117.954C273.998 118.985 273.323 119.905 272.476 120.65C271.629 121.395 270.631 121.947 269.55 122.27L268.974 118.436L273.609 115.907L274.275 115.578C274.275 115.578 274.356 116.636 274.455 117.954Z"
                        fill="#263238"
                      />
                      <path
                        d="M264.415 110.655C261.346 116.725 264.591 119.299 265.945 119.907C267.16 120.451 271.26 122.395 274.945 116.671C278.631 110.947 276.745 107.604 274.122 106.092C271.498 104.58 267.48 104.58 264.415 110.655Z"
                        fill="#F7A9A0"
                      />
                      <path
                        d="M265.378 109.494C265.527 109.531 265.677 109.56 265.828 109.58C265.986 109.633 266.157 109.633 266.314 109.58C266.362 109.553 266.399 109.512 266.42 109.462C266.441 109.413 266.445 109.357 266.431 109.305C266.388 109.207 266.32 109.123 266.234 109.06C266.148 108.997 266.047 108.957 265.941 108.945C265.729 108.891 265.504 108.918 265.311 109.022C265.266 109.047 265.23 109.085 265.207 109.132C265.185 109.178 265.177 109.23 265.184 109.281C265.191 109.332 265.214 109.379 265.248 109.417C265.283 109.455 265.328 109.482 265.378 109.494Z"
                        fill="#263238"
                      />
                      <path
                        d="M269.334 111.416C269.201 111.334 269.071 111.245 268.947 111.15C268.799 111.042 268.673 110.975 268.605 110.799C268.592 110.747 268.596 110.693 268.617 110.644C268.638 110.595 268.675 110.554 268.722 110.529C268.822 110.491 268.93 110.48 269.035 110.497C269.14 110.514 269.239 110.56 269.321 110.628C269.506 110.742 269.643 110.92 269.708 111.128C269.72 111.176 269.718 111.227 269.702 111.275C269.685 111.322 269.656 111.364 269.616 111.395C269.576 111.425 269.528 111.444 269.478 111.447C269.428 111.451 269.378 111.44 269.334 111.416Z"
                        fill="#263238"
                      />
                      <path
                        d="M267.75 112.572C267.75 112.572 267.777 112.604 267.75 112.622C267.548 113.04 267.386 113.553 267.705 113.864C267.705 113.864 267.705 113.895 267.705 113.886C267.3 113.612 267.503 112.95 267.75 112.572Z"
                        fill="#263238"
                      />
                      <path
                        d="M268.335 112.298C269.037 112.55 268.479 113.94 267.831 113.706C267.183 113.472 267.75 112.086 268.335 112.298Z"
                        fill="#263238"
                      />
                      <path
                        d="M268.578 112.5C268.668 112.626 268.731 112.815 268.87 112.887C269.01 112.959 269.221 112.887 269.388 112.784C269.289 113.054 269.077 113.283 268.776 113.207C268.648 113.155 268.544 113.058 268.483 112.934C268.422 112.81 268.41 112.669 268.447 112.536C268.47 112.5 268.542 112.428 268.578 112.5Z"
                        fill="#263238"
                      />
                      <path
                        d="M265.545 111.402C265.545 111.402 265.505 111.402 265.5 111.429C265.343 111.879 265.091 112.329 264.645 112.329C264.645 112.329 264.623 112.329 264.645 112.356C265.14 112.473 265.469 111.843 265.545 111.402Z"
                        fill="#263238"
                      />
                      <path
                        d="M265.338 110.804C264.668 110.475 264.065 111.848 264.69 112.154C265.316 112.46 265.901 111.074 265.338 110.804Z"
                        fill="#263238"
                      />
                      <path
                        d="M265.014 110.767C264.875 110.767 264.708 110.875 264.564 110.83C264.42 110.785 264.362 110.574 264.33 110.38C264.33 110.38 264.33 110.38 264.303 110.38C264.225 110.49 264.189 110.624 264.203 110.758C264.216 110.892 264.277 111.017 264.375 111.109C264.587 111.253 264.852 111.109 265.028 110.871C265.073 110.848 265.05 110.758 265.014 110.767Z"
                        fill="#263238"
                      />
                      <path
                        d="M265.288 113.603C265.114 113.894 264.955 114.195 264.811 114.503C264.811 114.53 264.865 114.575 264.964 114.624C265.203 114.778 265.48 114.863 265.764 114.87C266.048 114.878 266.329 114.806 266.575 114.665C266.611 114.665 266.575 114.597 266.548 114.606C266.055 114.709 265.542 114.649 265.086 114.435C265.086 114.345 265.725 113.427 265.68 113.4C265.436 113.325 265.183 113.282 264.928 113.274C265.63 111.996 266.53 110.844 267.21 109.562C267.214 109.552 267.214 109.542 267.211 109.532C267.208 109.523 267.202 109.514 267.193 109.509C267.185 109.503 267.175 109.5 267.165 109.501C267.155 109.501 267.145 109.505 267.138 109.512C266.137 110.718 265.259 112.021 264.514 113.4C264.433 113.571 265.144 113.603 265.288 113.603Z"
                        fill="#263238"
                      />
                      <path
                        d="M265.086 114.404C265.13 114.732 265.261 115.042 265.464 115.304C265.579 115.443 265.738 115.541 265.914 115.583C266.288 115.682 266.463 115.385 266.549 115.092C266.589 114.945 266.613 114.794 266.621 114.642C266.097 114.731 265.558 114.647 265.086 114.404Z"
                        fill="#263238"
                      />
                      <path
                        d="M265.464 115.29C265.579 115.43 265.737 115.528 265.914 115.569C266.287 115.668 266.463 115.371 266.549 115.079C266.37 114.988 266.166 114.96 265.97 114.998C265.774 115.037 265.596 115.139 265.464 115.29Z"
                        fill="#FF98B9"
                      />
                      <path
                        d="M273.411 117.45C272.241 116.613 274.077 113.877 274.077 113.877C274.077 113.877 272.344 112.109 272.466 110.178C272.466 110.178 272.196 111.74 272.641 112.766C272.713 112.941 268.951 109.697 270.742 106.331C270.742 106.331 268.002 108.972 265.72 108.311C265.608 108.275 267.939 105.71 268.992 105.471C270.188 105.21 271.427 105.226 272.616 105.518C273.805 105.81 274.911 106.369 275.85 107.154C278.1 109.256 277.884 113.004 277.321 114.21C276.228 116.577 273.964 117.846 273.411 117.45Z"
                        fill="#263238"
                      />
                      <path
                        d="M272.466 112.739C270.324 111.096 269.554 108.459 270.949 106.074C270.953 106.061 270.953 106.048 270.948 106.035C270.944 106.023 270.936 106.012 270.925 106.004C270.914 105.997 270.9 105.993 270.887 105.993C270.874 105.994 270.861 105.998 270.85 106.007C268.951 108.086 270.252 111.492 272.457 112.792C272.511 112.824 272.515 112.779 272.466 112.739Z"
                        fill="#263238"
                      />
                      <path
                        d="M273.492 117.32C272.727 115.866 273.375 114.534 274.14 113.27C274.14 113.229 274.104 113.189 274.077 113.225C273.222 114.408 272.412 116.028 273.379 117.41C273.391 117.424 273.409 117.434 273.428 117.436C273.447 117.438 273.466 117.433 273.481 117.421C273.496 117.409 273.505 117.391 273.507 117.372C273.509 117.353 273.504 117.334 273.492 117.32Z"
                        fill="#263238"
                      />
                      <path
                        d="M271.049 105.845C271.049 105.845 271.049 105.818 271.026 105.845C269.87 106.92 268.326 108.995 266.481 108.198C266.471 108.196 266.461 108.197 266.453 108.201C266.444 108.205 266.436 108.212 266.432 108.221C266.427 108.23 266.426 108.24 266.427 108.249C266.429 108.259 266.433 108.268 266.441 108.275C268.142 109.197 270.306 107.271 271.049 105.845Z"
                        fill="#263238"
                      />
                      <path
                        d="M272.444 128.7C269.667 132.192 258.129 143.131 253.935 142.461C247.361 141.399 238.536 136.746 234.689 135.013C232.601 134.073 240.579 121.887 242.469 123.619C244.935 125.869 254.003 129.767 255.069 130.293C256.136 130.819 263.799 126.693 269.469 124.015C274.235 121.765 275.958 124.267 272.444 128.7Z"
                        fill="#F7A9A0"
                      />
                      <path
                        d="M228.721 117.081C228.429 117.345 228.225 117.692 228.135 118.076C228.046 118.46 228.076 118.861 228.222 119.228C227.561 119.319 226.951 119.637 226.498 120.128C225.751 121.028 226.845 122.612 226.845 122.612C226.179 122.853 225.6 123.288 225.184 123.863C224.554 124.803 225.436 126.563 225.436 126.563C224.947 127.12 224.673 127.836 224.667 128.579C224.734 130.568 227.367 132.089 229.014 133.079C230.661 134.069 236.304 135.306 237.352 135.653L244.17 125.861C244.17 125.861 241.47 120.177 235.471 117.644C233.694 116.888 229.873 116.1 228.721 117.081Z"
                        fill="#F7A9A0"
                      />
                      <path
                        d="M228.398 119.102C230.481 119.435 232.353 120.37 234.27 121.194C234.279 121.198 234.286 121.205 234.29 121.213C234.294 121.222 234.294 121.232 234.29 121.241C234.287 121.25 234.28 121.257 234.271 121.261C234.262 121.265 234.252 121.265 234.243 121.261C232.344 120.415 230.301 119.961 228.393 119.196C228.383 119.192 228.375 119.186 228.369 119.177C228.363 119.168 228.36 119.158 228.36 119.147C228.361 119.137 228.365 119.126 228.371 119.118C228.378 119.11 228.387 119.104 228.398 119.102Z"
                        fill="#263238"
                      />
                      <path
                        d="M226.966 122.504C227.439 122.624 227.893 122.807 228.316 123.048C228.766 123.273 229.216 123.498 229.666 123.741C230.566 124.223 231.466 124.722 232.335 125.248C232.375 125.271 232.335 125.334 232.308 125.316C231.408 124.839 230.508 124.376 229.581 123.939C229.131 123.719 228.681 123.489 228.199 123.291C227.748 123.12 227.318 122.898 226.917 122.63C226.906 122.62 226.898 122.607 226.895 122.592C226.891 122.578 226.892 122.563 226.898 122.549C226.903 122.535 226.912 122.524 226.925 122.515C226.937 122.507 226.952 122.503 226.966 122.504Z"
                        fill="#263238"
                      />
                      <path
                        d="M225.472 126.581C225.893 126.695 226.291 126.883 226.647 127.134L227.871 127.809C228.685 128.259 229.504 128.709 230.337 129.11C230.377 129.11 230.337 129.2 230.305 129.177C229.459 128.759 228.604 128.354 227.763 127.926L226.521 127.292C226.128 127.132 225.766 126.905 225.45 126.621C225.45 126.621 225.45 126.576 225.472 126.581Z"
                        fill="#263238"
                      />
                      <path
                        d="M251.892 128.435L246.942 141.8C246.942 141.8 252.981 143.748 255.195 143.01C257.409 142.272 267.692 135.36 272.295 129.357C276.899 123.354 273.947 121.892 269.231 123.984C264.515 126.077 255.762 129.933 255.402 129.933C255.042 129.933 251.892 128.435 251.892 128.435Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M255.843 134.1C255.495 134.077 255.145 134.102 254.803 134.177C255.134 134.291 255.48 134.356 255.829 134.37C256.178 134.394 256.528 134.368 256.869 134.294C256.538 134.181 256.192 134.116 255.843 134.1ZM267.791 131.351C267.514 131.271 267.228 131.224 266.94 131.211C266.65 131.195 266.359 131.21 266.072 131.256C266.067 131.286 266.067 131.316 266.072 131.346C266.351 131.422 266.637 131.468 266.926 131.481C267.194 131.495 267.462 131.485 267.728 131.45C267.804 131.45 267.885 131.423 267.966 131.405L267.791 131.351ZM255.699 139.518C255.589 139.85 255.524 140.195 255.505 140.544C255.482 140.892 255.507 141.242 255.582 141.584C255.697 141.253 255.762 140.907 255.776 140.558C255.798 140.212 255.772 139.865 255.699 139.527V139.518ZM266.458 125.199L266.229 125.303C266.229 125.402 266.229 125.496 266.197 125.591C266.166 125.685 266.197 125.654 266.197 125.685C266.173 126.035 266.201 126.387 266.278 126.729C266.387 126.397 266.451 126.052 266.468 125.703C266.468 125.622 266.468 125.537 266.468 125.46C266.468 125.384 266.463 125.294 266.458 125.208V125.199ZM251.1 138.15C250.965 138.231 250.835 138.321 250.713 138.42L250.501 138.596C250.239 138.827 250.009 139.094 249.818 139.388C250.081 139.262 250.326 139.102 250.547 138.911L250.681 138.798C250.776 138.713 250.866 138.623 250.956 138.528C251.109 138.37 251.245 138.197 251.361 138.011C251.271 138.052 251.184 138.098 251.1 138.15ZM262.08 135.54C261.817 135.771 261.589 136.037 261.401 136.332C262.024 136.012 262.555 135.538 262.944 134.955C262.627 135.099 262.333 135.289 262.071 135.518L262.08 135.54ZM252.247 130.59L252.207 130.541L252.099 130.428C252.054 130.379 252.005 130.329 251.955 130.284C251.793 130.12 251.612 129.976 251.415 129.857C251.509 130.057 251.627 130.246 251.766 130.419C251.804 130.476 251.846 130.53 251.892 130.581L252.004 130.716L252.031 130.743C252.252 130.999 252.51 131.221 252.797 131.4C252.653 131.089 252.465 130.801 252.239 130.545L252.247 130.59ZM260.577 130.676C260.347 130.414 260.082 130.186 259.789 129.996C259.942 130.309 260.139 130.599 260.374 130.856C260.604 131.121 260.871 131.351 261.166 131.54C261.007 131.208 260.799 130.902 260.55 130.631L260.577 130.676ZM274.149 125.793L274.126 125.766C273.9 125.503 273.636 125.274 273.343 125.087C273.497 125.399 273.694 125.689 273.928 125.946L274.05 126.077C274.108 126.135 274.167 126.194 274.23 126.248L274.284 126.122C274.298 126.083 274.31 126.044 274.32 126.005C274.265 125.916 274.205 125.83 274.14 125.748L274.149 125.793Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M249.687 141.467C250.911 137.723 252.157 133.965 253.737 130.352C253.737 130.32 253.804 130.352 253.791 130.379C252.688 134.159 251.221 137.835 249.741 141.489C249.75 141.534 249.669 141.516 249.687 141.467Z"
                        fill="#263238"
                      />
                      <path
                        d="M275.053 106.47C277.65 107.636 280.372 110.25 281.137 119.7C281.902 129.15 280.44 136.085 277.659 137.732C274.878 139.379 268.825 138.514 265.585 136.026C265.585 136.026 272.254 128.956 273.235 118.588C273.546 115.276 271.525 110.084 272.812 107.672L275.053 106.47Z"
                        fill="#263238"
                      />
                      <path
                        d="M265.194 135.527C265.684 134.784 266.13 134.01 266.607 133.277C267.084 132.543 267.538 131.801 267.988 131.054C268.909 129.552 269.742 127.999 270.481 126.401C271.995 123.225 272.868 119.783 273.051 116.271C273.123 114.161 272.889 112.082 272.767 109.971C272.767 109.935 272.83 109.926 272.835 109.971C273.456 113.607 273.735 117.351 272.889 120.974C272.036 124.399 270.635 127.665 268.74 130.644C268.227 131.49 267.682 132.314 267.115 133.119C266.548 133.925 265.873 134.757 265.257 135.581C265.23 135.603 265.167 135.567 265.194 135.527Z"
                        fill="#263238"
                      />
                      <path
                        d="M277.754 109.22C277.727 109.188 277.785 109.143 277.812 109.175C280.152 112.046 281.097 115.79 281.705 119.372C282.437 123.384 282.349 127.503 281.448 131.481C281.204 132.511 280.868 133.517 280.445 134.487C280.011 135.413 279.496 136.298 278.906 137.133C278.879 137.178 278.811 137.133 278.847 137.088C279.434 136.33 279.89 135.48 280.197 134.573C280.502 133.728 280.747 132.864 280.931 131.985C281.359 130.045 281.596 128.067 281.637 126.081C281.746 122.236 281.291 118.396 280.287 114.683C279.772 112.726 278.915 110.876 277.754 109.22Z"
                        fill="#263238"
                      />
                      <path
                        d="M280.112 133.677C280.488 132.816 280.818 131.936 281.102 131.04C281.663 129.261 282.038 127.429 282.222 125.572C282.575 121.888 282.089 118.171 280.8 114.7C280.061 112.749 279.104 110.888 277.947 109.152C277.947 109.12 277.974 109.084 277.997 109.116C280.283 112.123 281.808 115.637 282.444 119.36C283.079 123.084 282.806 126.905 281.646 130.5C281.317 131.488 280.921 132.454 280.463 133.389C279.981 134.379 279.378 135.297 278.838 136.255C278.838 136.3 278.748 136.256 278.775 136.215C279.304 135.416 279.752 134.565 280.112 133.677Z"
                        fill="#263238"
                      />
                      <path
                        d="M272.795 114.476C272.795 114.476 274.469 112.496 275.378 113.126C276.287 113.756 274.901 116.703 273.735 117.023C273.588 117.073 273.433 117.094 273.278 117.083C273.123 117.073 272.972 117.031 272.834 116.96C272.695 116.889 272.573 116.792 272.473 116.672C272.374 116.553 272.299 116.415 272.255 116.267L272.795 114.476Z"
                        fill="#F7A9A0"
                      />
                      <path
                        d="M227.318 48.6945H51.8895V166.041H227.318V48.6945Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M226.039 50.1255H53.163V164.61H226.039V50.1255Z"
                        fill="#263238"
                      />
                      <path
                        d="M250.164 174.843H29.043V182.898H250.164V174.843Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M29.043 174.843L51.8895 166.041H227.317L250.164 174.843H29.043Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M53.9325 171.72L68.6745 166.041H210.533L225.275 171.72H53.9325Z"
                        fill="#263238"
                      />
                      <path
                        d="M216.275 58.824H62.937V155.911H216.275V58.824Z"
                        fill="white"
                      />
                      <path
                        d="M216.275 62.559H62.937V86.4495H216.275V62.559Z"
                        fill="#00FFB2"
                      />
                      <path
                        d="M208.273 67.1985H170.964V72.18H208.273V67.1985Z"
                        fill="white"
                      />
                      <path
                        d="M208.323 72.2295H170.91V67.1445H208.323V72.2295ZM171 72.126H208.21V67.248H171V72.126Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M208.327 67.1445H203.242V72.2295H208.327V67.1445Z"
                        fill="#455A64"
                      />
                      <path
                        d="M207.36 71.1L206.91 71.451L206.06 70.326L205.749 69.912C205.812 69.8869 205.871 69.8536 205.925 69.813C206.029 69.7327 206.111 69.6275 206.163 69.507L206.492 69.957L207.36 71.1Z"
                        fill="white"
                      />
                      <path
                        d="M206.456 68.4315C206.309 68.2422 206.112 68.0986 205.887 68.0176C205.662 67.9366 205.418 67.9217 205.185 67.9745C204.951 68.0273 204.738 68.1457 204.57 68.3157C204.401 68.4857 204.285 68.7003 204.235 68.9341C204.184 69.168 204.202 69.4114 204.285 69.6357C204.368 69.86 204.514 70.0559 204.704 70.2002C204.895 70.3446 205.123 70.4314 205.362 70.4505C205.6 70.4696 205.839 70.4202 206.051 70.308C206.109 70.272 206.168 70.236 206.222 70.1955C206.322 70.1194 206.41 70.0283 206.483 69.9255C206.637 69.7059 206.718 69.4427 206.713 69.1741C206.708 68.9055 206.618 68.6454 206.456 68.4315ZM205.916 69.7815C205.798 69.872 205.655 69.9254 205.507 69.9351C205.359 69.9447 205.211 69.9102 205.082 69.8358C204.953 69.7614 204.85 69.6505 204.784 69.5171C204.718 69.3837 204.694 69.2339 204.713 69.0865C204.733 68.9391 204.796 68.8008 204.894 68.6891C204.992 68.5775 205.121 68.4974 205.264 68.4591C205.408 68.4207 205.56 68.4259 205.701 68.4738C205.841 68.5218 205.965 68.6104 206.055 68.7285C206.136 68.8333 206.188 68.9575 206.205 69.0887C206.222 69.2199 206.205 69.3533 206.154 69.4755C206.104 69.6009 206.021 69.711 205.916 69.795V69.7815Z"
                        fill="white"
                      />
                      <path
                        d="M172.269 68.175H172.003V71.199H172.269V68.175Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M169.092 67.1985H83.1599V72.18H169.092V67.1985Z"
                        fill="white"
                      />
                      <path
                        d="M169.141 72.2295H83.106V67.1445H169.141V72.2295ZM83.1915 72.126H169.038V67.248H83.2095L83.1915 72.126Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M84.465 68.175H84.1995V71.199H84.465V68.175Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M73.7594 71.3925L71.9459 69.723L73.7549 67.986L74.0384 68.2785L72.5399 69.714L74.0339 71.091L73.7594 71.3925Z"
                        fill="white"
                      />
                      <path
                        d="M78.138 67.9815L79.9515 69.651L78.138 71.388L77.859 71.0955L79.3575 69.66L77.8635 68.283L78.138 67.9815Z"
                        fill="white"
                      />
                      <path
                        d="M216.275 58.824H62.937V62.559H216.275V58.824Z"
                        fill="#455A64"
                      />
                      <path
                        d="M66.4515 60.6915C66.4515 60.8312 66.41 60.9678 66.3324 61.084C66.2548 61.2002 66.1444 61.2907 66.0153 61.3442C65.8862 61.3977 65.7442 61.4117 65.6071 61.3844C65.4701 61.3571 65.3442 61.2899 65.2454 61.1911C65.1466 61.0923 65.0793 60.9664 65.052 60.8293C65.0248 60.6923 65.0388 60.5502 65.0922 60.4211C65.1457 60.292 65.2363 60.1817 65.3524 60.104C65.4686 60.0264 65.6052 59.985 65.745 59.985C65.9323 59.985 66.112 60.0594 66.2445 60.1919C66.377 60.3244 66.4515 60.5041 66.4515 60.6915Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M69.3404 60.6915C69.3413 60.8323 69.3004 60.9702 69.2228 61.0877C69.1452 61.2052 69.0345 61.2971 68.9047 61.3516C68.7748 61.4061 68.6317 61.4208 68.4935 61.3939C68.3553 61.367 68.2282 61.2996 68.1283 61.2003C68.0284 61.1011 67.9603 60.9744 67.9325 60.8364C67.9047 60.6983 67.9185 60.5551 67.9721 60.425C68.0258 60.2948 68.1169 60.1835 68.234 60.1051C68.351 60.0268 68.4886 59.985 68.6294 59.985C68.7226 59.9844 68.815 60.0022 68.9012 60.0375C68.9874 60.0727 69.0658 60.1247 69.1319 60.1903C69.198 60.256 69.2505 60.3341 69.2862 60.4201C69.322 60.5061 69.3404 60.5983 69.3404 60.6915Z"
                        fill="white"
                      />
                      <path
                        d="M71.5185 61.398C71.9087 61.398 72.225 61.0817 72.225 60.6915C72.225 60.3013 71.9087 59.985 71.5185 59.985C71.1283 59.985 70.812 60.3013 70.812 60.6915C70.812 61.0817 71.1283 61.398 71.5185 61.398Z"
                        fill="#00FFB2"
                      />
                      <path
                        d="M129.006 93.2805C129.966 96.3698 129.989 99.6742 129.073 102.777C128.156 105.879 126.341 108.641 123.857 110.712C121.372 112.784 118.329 114.073 115.113 114.417C111.896 114.761 108.649 114.144 105.783 112.644C102.917 111.145 100.559 108.829 99.0073 105.991C97.4557 103.152 96.78 99.9174 97.0653 96.695C97.3506 93.4726 98.5842 90.4069 100.61 87.8851C102.637 85.3632 105.365 83.4982 108.45 82.5255C110.506 81.8786 112.669 81.6438 114.816 81.8344C116.962 82.0251 119.051 82.6376 120.96 83.6367C122.87 84.6358 124.563 86.0019 125.944 87.6568C127.325 89.3117 128.365 91.2228 129.006 93.2805Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M117.94 112.644C115.07 113.549 111.995 113.581 109.106 112.737C106.217 111.893 103.643 110.21 101.711 107.903C99.7791 105.595 98.5753 102.766 98.2523 99.7731C97.9294 96.7806 98.5018 93.7596 99.8971 91.0927C101.292 88.4258 103.448 86.233 106.09 84.792C108.733 83.351 111.743 82.7267 114.741 82.998C117.739 83.2694 120.588 84.4243 122.929 86.3165C125.27 88.2086 126.996 90.7529 127.89 93.627C129.087 97.4682 128.711 101.627 126.846 105.192C124.981 108.757 121.778 111.437 117.94 112.644ZM126.49 94.3245C125.737 91.739 124.236 89.4342 122.175 87.7004C120.115 85.9666 117.587 84.8814 114.911 84.5814C112.235 84.2814 109.53 84.78 107.136 86.0145C104.743 87.249 102.768 89.1641 101.461 91.5186C100.155 93.8732 99.5736 96.5618 99.7917 99.2459C100.01 101.93 101.018 104.49 102.688 106.602C104.358 108.715 106.616 110.286 109.177 111.117C111.738 111.949 114.488 112.004 117.081 111.276C118.814 110.785 120.433 109.957 121.845 108.838C123.257 107.719 124.433 106.331 125.306 104.755C126.179 103.18 126.731 101.447 126.931 99.6566C127.132 97.8663 126.976 96.0542 126.472 94.3245H126.49Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M110.43 89.028L111.924 88.5555L112.059 89.0055C112.243 89.5905 112.432 90.1665 112.603 90.7515C112.671 90.972 112.761 90.999 112.981 90.963C113.622 90.8324 114.272 90.7571 114.925 90.738C116.599 90.738 117.697 91.6695 118.075 93.2985C118.151 93.5945 118.207 93.8952 118.242 94.1985C118.278 94.5679 118.229 94.9408 118.098 95.288C117.967 95.6353 117.757 95.9477 117.486 96.201L117.067 96.6105C117.346 96.633 117.589 96.6465 117.832 96.6825C118.47 96.7542 119.073 97.0122 119.565 97.4243C120.058 97.8365 120.417 98.3845 120.6 99C120.829 99.5966 120.936 100.233 120.915 100.872C120.894 101.296 120.788 101.712 120.602 102.094C120.416 102.476 120.156 102.816 119.835 103.095C119.083 103.738 118.209 104.223 117.265 104.522C117.045 104.603 116.977 104.679 117.058 104.918C117.252 105.485 117.409 106.065 117.594 106.637C117.639 106.781 117.625 106.871 117.477 106.916L116.194 107.321C116.136 107.127 116.082 106.956 116.028 106.785C115.875 106.299 115.717 105.818 115.578 105.332C115.528 105.165 115.461 105.102 115.285 105.165C115.011 105.264 114.727 105.345 114.417 105.444L115.114 107.649L113.62 108.122C113.386 107.388 113.17 106.668 112.923 105.917L109.219 107.087C108.949 106.236 108.693 105.422 108.427 104.576L109.521 104.234C108.621 101.349 107.721 98.5005 106.821 95.625L105.736 95.967C105.471 95.13 105.214 94.3155 104.949 93.4695L108.634 92.304L107.865 89.865L109.35 89.415L110.106 91.8225L111.204 91.476C110.938 90.6345 110.7 89.847 110.43 89.028ZM113.427 99.2115C113.179 99.288 112.936 99.3735 112.684 99.441C112.522 99.486 112.491 99.567 112.54 99.7245C112.86 100.719 113.175 101.709 113.481 102.708C113.539 102.902 113.634 102.924 113.805 102.866C114.232 102.722 114.669 102.596 115.096 102.452C115.493 102.34 115.833 102.084 116.05 101.734C116.267 101.384 116.346 100.966 116.271 100.562C116.258 100.289 116.181 100.023 116.044 99.7871C115.908 99.5507 115.717 99.3504 115.488 99.2029C115.258 99.0553 114.997 98.9648 114.725 98.9389C114.454 98.913 114.18 98.9525 113.926 99.054L113.427 99.2115ZM111.321 95.85C111.456 96.273 111.591 96.6915 111.721 97.119C111.762 97.2585 111.829 97.317 111.978 97.263C112.428 97.11 112.878 96.9795 113.328 96.813C113.553 96.7324 113.743 96.5762 113.866 96.3711C113.99 96.166 114.038 95.9246 114.003 95.688C113.967 95.368 113.886 95.0546 113.764 94.7565C113.705 94.5954 113.615 94.4476 113.498 94.3217C113.382 94.1958 113.241 94.0944 113.085 94.0232C112.929 93.952 112.76 93.9126 112.589 93.9072C112.417 93.9017 112.246 93.9304 112.086 93.9915C111.748 94.095 111.415 94.212 111.078 94.3065C110.916 94.3515 110.88 94.4325 110.934 94.5855C111.06 95.013 111.19 95.436 111.321 95.85Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M119.673 86.0445C121.287 86.8396 122.727 87.9488 123.907 89.307C125.085 90.682 125.981 92.2752 126.544 93.996C127.106 95.7234 127.315 97.5458 127.161 99.3555C127.011 101.169 126.5 102.934 125.658 104.548C124.817 106.161 123.662 107.59 122.26 108.752C120.173 110.505 117.603 111.585 114.89 111.85C112.177 112.115 109.447 111.553 107.059 110.237C109.455 111.426 112.147 111.89 114.803 111.57C117.459 111.25 119.963 110.161 122.008 108.437C124.718 106.126 126.425 102.855 126.769 99.3105C127.009 96.6463 126.465 93.97 125.205 91.6108C123.944 89.2515 122.021 87.3121 119.673 86.031V86.0445Z"
                        fill="white"
                      />
                      <path
                        d="M106.96 110.25C105.348 109.45 103.912 108.336 102.735 106.974C101.56 105.596 100.669 103.999 100.111 102.276C99.5536 100.548 99.35 98.7251 99.513 96.9165C99.6706 95.1015 100.19 93.3364 101.04 91.725C101.89 90.1137 103.054 88.6887 104.463 87.534C105.862 86.3737 107.479 85.5061 109.219 84.9825C110.954 84.4633 112.774 84.292 114.574 84.4785C116.364 84.6707 118.097 85.2217 119.668 86.0985C117.278 84.8979 114.589 84.4227 111.932 84.7313C109.275 85.0399 106.766 86.119 104.715 87.8355C101.988 90.1311 100.261 93.3974 99.9 96.9435C99.6495 99.6085 100.185 102.289 101.439 104.653C102.694 107.018 104.613 108.963 106.96 110.25Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M105.723 95.9445C105.646 95.742 105.57 95.535 105.498 95.3325C105.426 95.13 105.345 94.923 105.273 94.716L104.85 93.474L104.818 93.3885L104.908 93.3615C106.126 92.9535 107.355 92.565 108.594 92.196L108.535 92.313L108.18 91.08L108 90.45C107.943 90.243 107.889 90.036 107.838 89.829C107.914 90.0315 107.986 90.2295 108.058 90.432L108.279 91.035L108.693 92.241L108.724 92.3265L108.634 92.358C107.416 92.766 106.188 93.153 104.949 93.519L105.007 93.4065L105.372 94.6665C105.43 94.8735 105.484 95.0895 105.543 95.2965C105.601 95.5035 105.673 95.733 105.723 95.9445Z"
                        fill="white"
                      />
                      <path
                        d="M109.224 107.064C109.071 106.65 108.931 106.236 108.774 105.822C108.616 105.408 108.49 104.994 108.351 104.576L108.328 104.508L108.396 104.486L109.485 104.121L109.426 104.238L108.733 102.092C108.504 101.376 108.283 100.652 108.063 99.936C107.842 99.2205 107.613 98.496 107.41 97.776C107.208 97.056 106.996 96.3315 106.794 95.6025C107.05 96.3135 107.298 97.02 107.536 97.7355C107.775 98.451 108.018 99.162 108.247 99.8775C108.477 100.593 108.697 101.309 108.931 102.029L109.597 104.184L109.629 104.27L109.539 104.297L108.441 104.625L108.486 104.535C108.607 104.954 108.738 105.372 108.855 105.795C108.972 106.218 109.111 106.65 109.224 107.064Z"
                        fill="white"
                      />
                      <path
                        d="M113.805 102.866C114.034 102.767 114.255 102.681 114.502 102.587L115.209 102.335C115.423 102.244 115.614 102.107 115.77 101.935C115.925 101.762 116.041 101.558 116.109 101.336C116.239 100.875 116.193 100.382 115.978 99.954C115.878 99.7341 115.734 99.5366 115.555 99.3735C115.379 99.2011 115.167 99.0691 114.934 98.9865C115.187 99.0384 115.425 99.1461 115.63 99.3018C115.836 99.4576 116.004 99.6574 116.122 99.8865C116.256 100.114 116.341 100.366 116.375 100.627C116.408 100.889 116.388 101.154 116.316 101.408C116.236 101.662 116.097 101.894 115.91 102.084C115.723 102.274 115.494 102.417 115.24 102.501C114.777 102.627 114.3 102.758 113.805 102.866Z"
                        fill="white"
                      />
                      <path
                        d="M112.05 97.2585C112.423 97.092 112.819 96.9435 113.193 96.8085C113.365 96.7201 113.513 96.5925 113.626 96.4362C113.74 96.2799 113.815 96.0991 113.845 95.9085C113.908 95.522 113.844 95.1254 113.661 94.779C113.483 94.4156 113.199 94.1145 112.846 93.915C113.251 94.0521 113.592 94.3321 113.805 94.7025C114.039 95.0747 114.129 95.5197 114.057 95.9535C114.016 96.1725 113.921 96.3779 113.781 96.5515C113.642 96.725 113.461 96.8612 113.256 96.948C112.837 97.083 112.441 97.1685 112.05 97.2585Z"
                        fill="white"
                      />
                      <path
                        d="M112.95 105.894C113.139 106.233 113.29 106.593 113.4 106.965C113.522 107.333 113.605 107.713 113.647 108.099C113.459 107.76 113.308 107.4 113.197 107.028C113.076 106.659 112.993 106.279 112.95 105.894Z"
                        fill="white"
                      />
                      <path
                        d="M115.461 105.129C115.648 105.466 115.799 105.822 115.911 106.191C116.033 106.556 116.114 106.933 116.154 107.316C115.967 106.979 115.816 106.623 115.704 106.254C115.582 105.889 115.5 105.512 115.461 105.129Z"
                        fill="white"
                      />
                      <path
                        d="M181.8 84.762C181.096 87.9202 179.471 90.7988 177.132 93.0344C174.793 95.2699 171.844 96.7622 168.657 97.3226C165.47 97.883 162.189 97.4865 159.227 96.1831C156.265 94.8797 153.756 92.7279 152.017 89.9995C150.278 87.2711 149.386 84.0884 149.454 80.8534C149.522 77.6184 150.548 74.4762 152.401 71.8236C154.254 69.171 156.851 67.1271 159.865 65.9499C162.879 64.7727 166.175 64.515 169.335 65.2095C171.439 65.6724 173.43 66.5457 175.196 67.7795C176.962 69.0133 178.466 70.5833 179.624 72.3995C180.782 74.2158 181.57 76.2426 181.944 78.364C182.317 80.4854 182.268 82.6595 181.8 84.762Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M162.589 96.0525C159.65 95.4094 156.967 93.9084 154.882 91.7396C152.796 89.5708 151.401 86.8317 150.873 83.8693C150.345 80.9069 150.708 77.8545 151.916 75.0988C153.125 72.343 155.124 70.0078 157.66 68.389C160.197 66.7701 163.156 65.9405 166.165 66.0052C169.173 66.0699 172.095 67.0259 174.559 68.7522C177.024 70.4786 178.92 72.8975 180.009 75.7027C181.098 78.5079 181.33 81.573 180.675 84.51C179.802 88.436 177.408 91.8558 174.018 94.0195C170.628 96.1832 166.518 96.9143 162.589 96.0525ZM179.1 84.4065C179.733 81.789 179.578 79.0427 178.653 76.5133C177.729 73.984 176.076 71.7849 173.904 70.193C171.732 68.601 169.137 67.6875 166.447 67.5673C163.757 67.4472 161.091 68.126 158.786 69.518C156.48 70.9101 154.639 72.9532 153.492 75.3901C152.346 77.8269 151.947 80.5485 152.344 83.212C152.742 85.8755 153.919 88.3618 155.727 90.3577C157.534 92.3536 159.893 93.7698 162.504 94.428C164.252 94.8673 166.07 94.9562 167.852 94.6896C169.635 94.4229 171.347 93.8059 172.889 92.8743C174.432 91.9426 175.775 90.7147 176.841 89.2613C177.907 87.808 178.675 86.158 179.1 84.4065Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M167.823 71.829L169.353 72.162L169.259 72.612C169.128 73.2105 169.007 73.8045 168.863 74.412C168.809 74.6325 168.863 74.7045 169.083 74.781C169.703 74.9893 170.304 75.2466 170.883 75.5505C172.332 76.3965 172.823 77.7375 172.35 79.3485C172.267 79.6414 172.165 79.9285 172.044 80.208C171.892 80.5454 171.664 80.8429 171.377 81.0771C171.09 81.3113 170.753 81.476 170.393 81.558C170.217 81.6075 170.037 81.648 169.826 81.702C170.055 81.864 170.276 81.9945 170.456 82.152C170.975 82.5306 171.37 83.0544 171.592 83.6575C171.814 84.2605 171.852 84.9157 171.702 85.5405C171.608 86.179 171.384 86.7915 171.045 87.3405C170.816 87.6975 170.518 88.0047 170.168 88.2437C169.817 88.4826 169.422 88.6484 169.007 88.731C168.026 88.9019 167.02 88.8744 166.05 88.65C165.821 88.6095 165.726 88.65 165.677 88.8885C165.56 89.478 165.411 90.0585 165.281 90.648C165.249 90.792 165.195 90.864 165.042 90.8325L163.733 90.5445C163.773 90.351 163.814 90.171 163.85 89.9955C163.958 89.5005 164.061 89.001 164.178 88.506C164.219 88.3395 164.178 88.2495 164.003 88.218C163.715 88.1685 163.431 88.0965 163.103 88.029C162.932 88.7985 162.774 89.532 162.608 90.279L161.078 89.9415C161.24 89.19 161.402 88.4565 161.568 87.6915L157.775 86.8635C157.964 85.9905 158.148 85.158 158.337 84.2895L159.458 84.537C160.101 81.585 160.74 78.687 161.384 75.717L160.272 75.4785C160.457 74.619 160.641 73.782 160.83 72.918L164.606 73.7415C164.79 72.891 164.97 72.0765 165.155 71.2395L166.671 71.5725C166.496 72.3825 166.316 73.197 166.136 74.0385L167.261 74.286C167.463 73.4805 167.643 72.6705 167.823 71.829ZM165.353 82.1565C165.101 82.098 164.849 82.053 164.597 81.9855C164.435 81.945 164.367 81.9855 164.331 82.1565C164.115 83.178 163.881 84.1995 163.661 85.2165C163.616 85.41 163.688 85.4775 163.863 85.5135C164.313 85.599 164.763 85.707 165.191 85.7925C165.589 85.8953 166.012 85.844 166.375 85.6488C166.738 85.4537 167.014 85.129 167.148 84.7395C167.273 84.4971 167.338 84.2284 167.337 83.9558C167.337 83.6831 167.271 83.4146 167.146 83.1726C167.02 82.9307 166.838 82.7223 166.615 82.5651C166.393 82.4079 166.136 82.3064 165.866 82.269L165.353 82.1565ZM165.195 78.201C165.101 78.651 165.011 79.065 164.912 79.497C164.88 79.641 164.912 79.7265 165.065 79.7535C165.515 79.8435 165.965 79.956 166.451 80.0235C166.686 80.066 166.928 80.0255 167.137 79.9089C167.345 79.7923 167.507 79.607 167.594 79.3845C167.721 79.0886 167.807 78.7767 167.85 78.4575C167.879 78.2884 167.874 78.1152 167.835 77.948C167.797 77.7808 167.726 77.6229 167.625 77.4835C167.525 77.3441 167.399 77.2259 167.253 77.1359C167.107 77.0459 166.944 76.9857 166.775 76.959C166.433 76.878 166.086 76.815 165.744 76.7295C165.578 76.689 165.51 76.7295 165.479 76.9005C165.393 77.3325 165.294 77.7645 165.195 78.201Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M177.322 73.8405C178.33 75.3362 179.027 77.0197 179.37 78.7905C179.713 80.5755 179.699 82.4108 179.329 84.1905C178.956 85.9662 178.23 87.6491 177.196 89.1405C176.161 90.637 174.839 91.914 173.308 92.898C171.772 93.8729 170.06 94.5379 168.268 94.8555C166.482 95.1685 164.652 95.122 162.884 94.7186C161.116 94.3153 159.446 93.5632 157.972 92.5065C156.512 91.4518 155.279 90.1143 154.345 88.5735C155.83 90.799 157.932 92.5426 160.393 93.5898C162.854 94.6371 165.568 94.9425 168.201 94.4685C171.701 93.8086 174.809 91.8183 176.872 88.9155C178.407 86.7243 179.267 84.1324 179.347 81.4587C179.426 78.7851 178.723 76.1464 177.322 73.8675V73.8405Z"
                        fill="white"
                      />
                      <path
                        d="M154.26 88.506C153.256 87.0094 152.565 85.3259 152.226 83.556C151.89 81.7773 151.91 79.9495 152.285 78.1785C152.661 76.4005 153.393 74.7169 154.436 73.2285C155.472 71.7333 156.797 70.4604 158.333 69.4844C159.868 68.5084 161.583 67.849 163.377 67.545C165.169 67.2303 167.006 67.2823 168.777 67.698C170.54 68.1091 172.204 68.8646 173.673 69.921C175.123 70.9823 176.347 72.3225 177.273 73.863C175.794 71.6381 173.698 69.8934 171.241 68.843C168.785 67.7926 166.075 67.4822 163.445 67.95C161.708 68.2652 160.049 68.9164 158.562 69.867C157.069 70.805 155.775 72.0284 154.755 73.467C153.215 75.6542 152.348 78.2436 152.26 80.9171C152.172 83.5905 152.867 86.2314 154.26 88.515V88.506Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M160.299 75.492C160.331 75.2715 160.367 75.042 160.407 74.844C160.448 74.646 160.479 74.394 160.52 74.196L160.767 72.909V72.8235H160.857C162.123 73.0755 163.383 73.35 164.637 73.647L164.529 73.719L164.835 72.4725L164.993 71.856C165.047 71.649 165.105 71.442 165.164 71.235L165.056 71.8695L164.943 72.4995L164.705 73.755V73.845H164.615C163.352 73.59 162.093 73.314 160.839 73.017L160.947 72.9495L160.632 74.223C160.583 74.4345 160.524 74.646 160.47 74.8575C160.416 75.069 160.358 75.2805 160.299 75.492Z"
                        fill="white"
                      />
                      <path
                        d="M157.802 86.877C157.874 86.427 157.959 86.013 158.04 85.581C158.121 85.149 158.207 84.7215 158.292 84.2895V84.2175H158.364L159.489 84.4425L159.381 84.51L159.831 82.305C159.989 81.567 160.16 80.838 160.322 80.1045C160.484 79.371 160.659 78.6375 160.835 77.904C161.01 77.1705 161.19 76.4415 161.379 75.7125C161.244 76.455 161.109 77.1975 160.961 77.931C160.812 78.6645 160.668 79.407 160.511 80.145C160.353 80.883 160.2 81.6165 160.038 82.35L159.543 84.5505L159.521 84.6405H159.431L158.315 84.375L158.4 84.321C158.297 84.744 158.202 85.1715 158.094 85.599C157.986 86.0265 157.914 86.4495 157.802 86.877Z"
                        fill="white"
                      />
                      <path
                        d="M163.863 85.5C164.115 85.527 164.358 85.572 164.606 85.608L165.344 85.7385C165.576 85.7688 165.813 85.7479 166.037 85.6771C166.261 85.6064 166.466 85.4876 166.64 85.329C166.98 84.9929 167.184 84.5423 167.211 84.0645C167.235 83.8233 167.209 83.5797 167.135 83.349C167.068 83.1114 166.95 82.8916 166.788 82.7055C166.98 82.8728 167.133 83.0807 167.235 83.3142C167.337 83.5476 167.385 83.8009 167.378 84.0555C167.38 84.3191 167.329 84.5805 167.227 84.8235C167.125 85.0665 166.974 85.286 166.784 85.4685C166.589 85.6502 166.354 85.7823 166.098 85.8536C165.842 85.9249 165.572 85.9333 165.312 85.878C164.826 85.788 164.345 85.662 163.863 85.5Z"
                        fill="white"
                      />
                      <path
                        d="M165.119 79.767C165.528 79.812 165.947 79.8795 166.338 79.9425C166.529 79.9506 166.719 79.9142 166.893 79.8361C167.067 79.758 167.221 79.6403 167.342 79.4925C167.59 79.1891 167.732 78.8131 167.747 78.4215C167.771 78.0154 167.674 77.6112 167.468 77.2605C167.754 77.5795 167.914 77.9925 167.918 78.4215C167.935 78.8609 167.791 79.2915 167.513 79.632C167.367 79.7987 167.182 79.927 166.975 80.0055C166.768 80.0839 166.544 80.1102 166.325 80.082C165.902 80.0145 165.515 79.893 165.119 79.767Z"
                        fill="white"
                      />
                      <path
                        d="M161.595 87.705C161.587 88.0927 161.54 88.4786 161.455 88.857C161.376 89.2354 161.259 89.6048 161.104 89.9595C161.108 89.5715 161.155 89.1851 161.244 88.8075C161.321 88.4285 161.439 88.0589 161.595 87.705Z"
                        fill="white"
                      />
                      <path
                        d="M164.173 88.299C164.166 88.6837 164.119 89.0667 164.034 89.442C163.956 89.8208 163.838 90.1903 163.683 90.5445C163.69 90.1582 163.737 89.7737 163.822 89.397C163.9 89.0195 164.018 88.6514 164.173 88.299Z"
                        fill="white"
                      />
                      <path
                        d="M175.585 142.524C174.881 145.682 173.256 148.561 170.917 150.796C168.577 153.032 165.628 154.524 162.441 155.084C159.254 155.644 155.972 155.247 153.011 153.943C150.049 152.639 147.54 150.487 145.801 147.758C144.062 145.029 143.171 141.846 143.24 138.611C143.309 135.376 144.335 132.234 146.189 129.582C148.042 126.929 150.64 124.886 153.655 123.709C156.669 122.533 159.965 122.276 163.125 122.971C165.228 123.435 167.219 124.309 168.984 125.543C170.75 126.777 172.254 128.347 173.411 130.163C174.569 131.979 175.357 134.006 175.73 136.127C176.103 138.248 176.054 140.422 175.585 142.524Z"
                        fill="#EBEBEB"
                      />
                      <path
                        d="M156.357 153.814C153.418 153.171 150.736 151.669 148.651 149.5C146.566 147.331 145.171 144.591 144.644 141.629C144.117 138.667 144.481 135.615 145.689 132.86C146.898 130.104 148.897 127.769 151.433 126.151C153.97 124.533 156.93 123.703 159.938 123.768C162.946 123.833 165.867 124.789 168.331 126.515C170.796 128.242 172.692 130.66 173.781 133.465C174.87 136.27 175.101 139.335 174.447 142.272C173.574 146.199 171.18 149.62 167.788 151.783C164.397 153.947 160.286 154.678 156.357 153.814ZM172.868 142.168C173.5 139.551 173.344 136.805 172.418 134.276C171.493 131.747 169.84 129.548 167.668 127.957C165.495 126.366 162.901 125.453 160.211 125.333C157.52 125.214 154.855 125.893 152.55 127.286C150.245 128.678 148.404 130.721 147.258 133.158C146.112 135.595 145.713 138.317 146.111 140.98C146.509 143.643 147.686 146.129 149.494 148.125C151.302 150.121 153.66 151.537 156.271 152.194C158.02 152.634 159.838 152.724 161.621 152.457C163.404 152.19 165.116 151.573 166.659 150.641C168.202 149.709 169.545 148.48 170.611 147.026C171.677 145.572 172.444 143.921 172.868 142.168Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M161.595 129.6L163.12 129.933L163.026 130.383C162.895 130.981 162.774 131.575 162.63 132.183C162.576 132.403 162.63 132.475 162.855 132.552C163.475 132.76 164.077 133.019 164.655 133.326C166.104 134.167 166.599 135.508 166.122 137.119C166.041 137.413 165.939 137.7 165.816 137.979C165.664 138.316 165.435 138.614 165.149 138.848C164.862 139.082 164.525 139.247 164.164 139.329C163.989 139.378 163.809 139.419 163.597 139.473C163.827 139.635 164.047 139.765 164.227 139.923C164.747 140.302 165.143 140.827 165.364 141.431C165.586 142.035 165.624 142.691 165.474 143.316C165.379 143.947 165.155 144.552 164.817 145.093C164.588 145.451 164.29 145.758 163.939 145.997C163.589 146.236 163.194 146.401 162.778 146.484C161.804 146.666 160.804 146.653 159.835 146.443C159.606 146.403 159.511 146.443 159.462 146.682C159.349 147.271 159.196 147.856 159.07 148.441C159.039 148.585 158.98 148.657 158.827 148.626L157.5 148.32C157.54 148.122 157.581 147.942 157.621 147.766C157.729 147.271 157.833 146.772 157.945 146.277C157.986 146.11 157.945 146.021 157.774 145.989C157.486 145.94 157.198 145.867 156.874 145.8C156.708 146.569 156.546 147.303 156.379 148.05L154.849 147.712C155.011 146.961 155.173 146.227 155.34 145.462L151.546 144.634C151.735 143.761 151.92 142.929 152.109 142.06L153.229 142.308C153.873 139.356 154.512 136.435 155.155 133.492L154.044 133.249C154.233 132.39 154.413 131.558 154.602 130.689L158.377 131.512C158.566 130.662 158.742 129.847 158.926 129.01L160.447 129.343C160.267 130.153 160.092 130.972 159.907 131.809L161.032 132.057C161.235 131.242 161.41 130.432 161.595 129.6ZM159.12 139.928C158.868 139.874 158.616 139.824 158.364 139.756C158.202 139.716 158.134 139.756 158.098 139.932C157.882 140.949 157.648 141.97 157.432 142.987C157.387 143.181 157.432 143.248 157.635 143.284C158.085 143.37 158.535 143.478 158.958 143.563C159.357 143.665 159.781 143.614 160.144 143.419C160.507 143.224 160.784 142.9 160.92 142.51C161.044 142.268 161.108 141.999 161.107 141.727C161.106 141.455 161.04 141.187 160.915 140.945C160.789 140.703 160.608 140.495 160.386 140.338C160.163 140.18 159.907 140.078 159.637 140.04L159.12 139.928ZM158.967 135.972C158.872 136.422 158.782 136.836 158.679 137.268C158.647 137.412 158.679 137.497 158.832 137.524C159.282 137.614 159.754 137.727 160.218 137.794C160.453 137.837 160.695 137.796 160.904 137.68C161.112 137.563 161.274 137.378 161.361 137.156C161.489 136.86 161.577 136.548 161.622 136.229C161.651 136.059 161.646 135.886 161.607 135.718C161.568 135.551 161.496 135.393 161.396 135.253C161.295 135.114 161.168 134.996 161.021 134.906C160.875 134.816 160.712 134.756 160.542 134.73C160.2 134.649 159.853 134.586 159.516 134.501C159.349 134.46 159.282 134.5 159.246 134.671C159.16 135.094 159.061 135.527 158.967 135.963V135.972Z"
                        fill="#DBDBDB"
                      />
                      <path
                        d="M171.09 131.603C172.099 133.098 172.797 134.781 173.142 136.553C173.48 138.331 173.465 140.158 173.097 141.93C172.725 143.706 172 145.39 170.964 146.88C169.928 148.377 168.607 149.654 167.076 150.638C165.54 151.612 163.827 152.277 162.036 152.595C160.25 152.907 158.419 152.86 156.651 152.457C154.884 152.054 153.214 151.302 151.74 150.246C150.28 149.191 149.046 147.854 148.113 146.313C149.597 148.539 151.699 150.282 154.16 151.329C156.622 152.377 159.336 152.682 161.968 152.208C165.471 151.554 168.581 149.562 170.64 146.655C172.173 144.463 173.033 141.87 173.113 139.196C173.193 136.522 172.49 133.883 171.09 131.603Z"
                        fill="white"
                      />
                      <path
                        d="M148.05 146.25C147.05 144.751 146.359 143.069 146.016 141.3C145.684 139.521 145.704 137.694 146.074 135.922C146.451 134.145 147.183 132.461 148.225 130.972C149.262 129.477 150.587 128.204 152.123 127.228C153.658 126.252 155.373 125.593 157.167 125.289C158.959 124.974 160.796 125.026 162.567 125.442C164.33 125.853 165.993 126.609 167.463 127.665C168.913 128.727 170.136 130.067 171.063 131.607C169.586 129.376 167.49 127.626 165.031 126.572C162.573 125.517 159.859 125.204 157.225 125.671C153.722 126.316 150.605 128.298 148.536 131.197C146.996 133.386 146.13 135.977 146.044 138.651C145.958 141.325 146.655 143.967 148.05 146.25Z"
                        fill="#C7C7C7"
                      />
                      <path
                        d="M154.066 133.254C154.098 133.038 154.138 132.804 154.174 132.606C154.21 132.408 154.246 132.156 154.291 131.958L154.534 130.671V130.586H154.629C155.889 130.838 157.147 131.112 158.404 131.409L158.296 131.481L158.602 130.235L158.764 129.618C158.818 129.411 158.872 129.204 158.931 128.997C158.898 129.21 158.862 129.422 158.823 129.632L158.715 130.262L158.472 131.517V131.607H158.382C157.117 131.351 155.862 131.076 154.606 130.779L154.714 130.712L154.404 131.985C154.35 132.197 154.291 132.408 154.237 132.62C154.183 132.831 154.125 133.043 154.066 133.254Z"
                        fill="white"
                      />
                      <path
                        d="M151.569 144.639C151.645 144.189 151.726 143.775 151.807 143.343C151.888 142.911 151.978 142.484 152.059 142.052V141.98H152.131L153.256 142.205L153.148 142.272L153.598 140.067C153.756 139.329 153.927 138.6 154.089 137.867C154.251 137.133 154.426 136.4 154.602 135.666C154.777 134.933 154.957 134.204 155.146 133.479C155.016 134.217 154.876 134.96 154.728 135.693C154.579 136.427 154.435 137.169 154.278 137.907C154.12 138.645 153.972 139.378 153.805 140.112L153.31 142.313L153.288 142.403H153.202L152.082 142.137L152.172 142.083C152.068 142.506 151.969 142.938 151.861 143.361C151.753 143.784 151.681 144.212 151.569 144.639Z"
                        fill="white"
                      />
                      <path
                        d="M157.635 143.275C157.882 143.302 158.13 143.347 158.377 143.383L159.115 143.514C159.348 143.544 159.583 143.523 159.807 143.452C160.03 143.382 160.235 143.263 160.407 143.104C160.66 142.849 160.839 142.531 160.927 142.183C161.015 141.834 161.008 141.469 160.906 141.124C160.836 140.889 160.718 140.67 160.56 140.481C160.75 140.649 160.901 140.858 161.002 141.091C161.103 141.324 161.152 141.577 161.145 141.831C161.147 142.094 161.096 142.355 160.995 142.598C160.894 142.841 160.744 143.061 160.555 143.244C160.36 143.425 160.124 143.557 159.867 143.629C159.61 143.7 159.34 143.708 159.079 143.653C158.593 143.55 158.112 143.424 157.635 143.275Z"
                        fill="white"
                      />
                      <path
                        d="M158.891 137.529C159.296 137.574 159.714 137.641 160.106 137.704C160.297 137.712 160.487 137.676 160.662 137.598C160.837 137.52 160.992 137.402 161.114 137.254C161.36 136.951 161.5 136.575 161.514 136.183C161.54 135.779 161.445 135.376 161.24 135.027C161.525 135.345 161.685 135.756 161.69 136.183C161.708 136.622 161.566 137.053 161.289 137.394C161.143 137.561 160.957 137.69 160.749 137.769C160.541 137.847 160.317 137.873 160.096 137.844C159.669 137.776 159.3 137.655 158.891 137.529Z"
                        fill="white"
                      />
                      <path
                        d="M155.362 145.467C155.357 145.855 155.31 146.241 155.223 146.619C155.146 146.998 155.028 147.368 154.872 147.722C154.88 147.334 154.927 146.948 155.011 146.57C155.091 146.191 155.208 145.822 155.362 145.467Z"
                        fill="white"
                      />
                      <path
                        d="M157.95 146.061C157.947 146.446 157.9 146.829 157.81 147.204C157.733 147.583 157.616 147.953 157.459 148.306C157.479 147.532 157.646 146.769 157.95 146.056V146.061Z"
                        fill="white"
                      />
                      <path
                        d="M146.137 155.911H130.882L130.707 156.582C130.707 156.357 130.707 156.132 130.707 155.911H127.935L127.692 128.187V128.11L127.669 125.469V124.141L127.647 121.72V120.978L127.602 115.744V115.542H144.504L144.679 119.848V119.934L144.76 121.896L144.81 123.066V123.327L144.864 124.623L144.994 127.773L146.137 155.911Z"
                        fill="#263238"
                      />
                      <path
                        d="M131.188 155.911H130.882L130.707 156.582C130.707 156.357 130.707 156.132 130.707 155.911C130.707 155.295 130.707 154.674 130.707 154.057C130.689 152.185 130.674 150.315 130.662 148.446C130.635 144.333 130.618 140.217 130.612 136.098C130.612 133.914 130.612 131.728 130.612 129.541C130.612 127.962 130.612 126.391 130.612 124.798C130.612 124.308 130.612 123.822 130.612 123.331C130.612 121.603 130.63 119.872 130.666 118.138C130.666 118.138 130.689 118.138 130.693 118.138C130.734 119.772 130.765 121.401 130.788 123.034C130.788 123.624 130.788 124.213 130.815 124.798C130.815 126.418 130.851 128.038 130.869 129.658C130.896 132.534 130.918 135.414 130.963 138.289C131.002 141.034 131.044 143.781 131.089 146.529C131.131 149.292 131.173 152.053 131.215 154.813C131.175 155.182 131.184 155.547 131.188 155.911Z"
                        fill="#37474F"
                      />
                      <path
                        d="M141.57 115.537L141.426 116.082L141.377 116.275L140.882 118.138L140.504 119.569L140.207 120.69L139.847 122.04L139.14 124.695L137.849 129.6L137.399 131.323L137.331 131.584L137.295 131.71V131.769L136.935 133.119L136.863 133.393L136.805 133.614L131.171 154.8L130.883 155.893L130.707 156.564C130.707 156.339 130.707 156.114 130.707 155.893H127.935L127.692 128.169V128.092L127.67 125.451V124.794V124.128V121.702V120.96L127.625 115.726V115.524L141.57 115.537Z"
                        fill="#37474F"
                      />
                      <path
                        d="M142.749 115.519C142.722 115.641 142.569 116.352 142.33 117.427C142.33 117.427 142.33 117.45 142.33 117.463C142.33 117.477 142.33 117.531 142.308 117.567C142.186 118.098 142.051 118.71 141.898 119.367C141.795 119.817 141.691 120.267 141.579 120.717C141.286 121.959 140.962 123.318 140.625 124.654C140.508 125.104 140.391 125.554 140.274 126.004C140.026 126.958 139.779 127.881 139.54 128.704C139.224 130.011 138.772 131.281 138.19 132.493C138.135 132.602 138.055 132.696 137.956 132.768C137.772 132.876 137.371 133.074 136.872 133.308L136.647 133.411L136.39 133.533C135.346 134.01 134.095 134.559 133.506 134.806C133.504 134.818 133.504 134.831 133.506 134.842C133.411 135.292 132.444 140.103 131.094 146.439C130.959 147.064 130.824 147.699 130.684 148.351C130.176 150.723 129.622 153.252 129.051 155.817H109.323C112.563 144.117 116.073 130.873 116.073 130.873C116.091 128.814 116.241 126.758 116.523 124.717C116.658 123.727 116.838 122.692 117.067 121.662C117.067 121.59 117.099 121.518 117.117 121.446C117.127 121.412 117.134 121.377 117.139 121.342C117.139 121.266 117.175 121.194 117.198 121.117C117.72 118.971 118.494 116.901 119.632 115.425L142.749 115.519Z"
                        fill="#263238"
                      />
                      <path
                        d="M120.969 127.98C121.503 127.866 122.042 127.779 122.584 127.719C123.012 127.647 123.444 127.575 123.867 127.48C124.678 127.33 125.447 127.003 126.117 126.522C126.855 125.95 127.233 125.077 127.588 124.24C127.8 123.741 128.038 123.246 128.241 122.755C128.349 122.512 128.457 122.274 128.569 122.04C128.719 121.761 128.853 121.474 128.97 121.18C128.97 121.135 129.051 121.158 129.037 121.18C128.964 121.382 128.903 121.588 128.853 121.797L128.641 122.521C128.506 122.944 128.376 123.376 128.236 123.799C128.028 124.583 127.726 125.338 127.336 126.049C126.549 127.3 125.14 127.809 123.736 127.984C123.331 128.038 122.922 128.065 122.517 128.088C122.005 128.135 121.49 128.135 120.978 128.088C120.97 128.082 120.963 128.074 120.958 128.065C120.953 128.056 120.95 128.046 120.949 128.036C120.948 128.026 120.949 128.016 120.953 128.006C120.956 127.996 120.962 127.987 120.969 127.98Z"
                        fill="#37474F"
                      />
                      <path
                        d="M139.473 132.084C137.403 132.84 135.402 133.773 133.492 134.874C133.479 134.883 133.47 134.896 133.465 134.911C133.461 134.927 133.462 134.943 133.468 134.957C133.475 134.972 133.486 134.984 133.501 134.991C133.515 134.998 133.531 134.999 133.546 134.995C135.562 134.131 137.619 133.303 139.581 132.327C139.607 132.309 139.627 132.283 139.635 132.252C139.644 132.222 139.642 132.189 139.629 132.16C139.616 132.131 139.593 132.108 139.565 132.094C139.536 132.08 139.504 132.076 139.473 132.084Z"
                        fill="#37474F"
                      />
                      <path
                        d="M140.08 118.282C140.08 118.21 139.954 118.197 139.954 118.282C139.954 120.672 139.815 122.782 139.617 125.032C139.522 126.072 138.685 131.81 136.885 131.391C136.584 131.319 136.435 131.022 136.386 130.567C136.392 129.973 136.472 129.382 136.624 128.808C136.822 127.606 136.984 126.405 137.074 125.208C137.283 122.949 137.257 120.675 136.998 118.422C136.994 118.41 136.987 118.399 136.977 118.391C136.967 118.384 136.954 118.38 136.942 118.38C136.929 118.38 136.917 118.384 136.906 118.391C136.896 118.399 136.889 118.41 136.885 118.422C136.939 121.54 136.76 124.659 136.35 127.751C136.125 129.245 135.373 131.49 136.935 131.719C138.496 131.949 139.549 128.191 139.743 127.161C140.24 124.229 140.353 121.244 140.08 118.282Z"
                        fill="#37474F"
                      />
                      <path
                        d="M136.935 131.517C136.776 131.904 136.641 132.301 136.53 132.705C136.415 133.017 136.358 133.349 136.363 133.681C136.366 133.695 136.372 133.707 136.381 133.716C136.39 133.726 136.402 133.732 136.415 133.735C136.428 133.738 136.442 133.737 136.454 133.732C136.467 133.728 136.477 133.719 136.485 133.708C136.673 133.416 136.814 133.095 136.903 132.759C137.043 132.39 137.187 132.025 137.313 131.656C137.326 131.608 137.32 131.556 137.296 131.512C137.273 131.468 137.234 131.433 137.187 131.416C137.14 131.399 137.088 131.399 137.042 131.418C136.995 131.437 136.957 131.472 136.935 131.517Z"
                        fill="#37474F"
                      />
                      <path
                        d="M118.885 125.311C118.971 126.661 119.335 128.011 119.313 129.411C119.222 130.781 118.99 132.138 118.62 133.461C117.318 139.059 115.923 144.63 114.435 150.174C113.922 152.091 113.397 154.005 112.86 155.916H112.41C112.774 154.611 113.139 153.302 113.494 151.992C114.994 146.481 116.406 140.943 117.729 135.378C118.062 133.987 118.422 132.597 118.692 131.193C118.933 129.774 118.933 128.324 118.692 126.904C118.595 126.216 118.542 125.521 118.534 124.825C118.526 124.239 118.562 123.652 118.642 123.07C118.642 123.021 118.642 122.967 118.665 122.917C118.687 122.868 118.665 122.836 118.665 122.796C118.665 122.755 118.665 122.724 118.665 122.688C118.665 122.652 118.696 122.512 118.71 122.422C118.921 121.272 119.205 120.135 119.56 119.02C119.772 118.345 120.01 117.67 120.231 117.013C120.238 117.001 120.249 116.992 120.262 116.987C120.276 116.982 120.29 116.981 120.304 116.986C120.317 116.99 120.329 116.998 120.337 117.01C120.345 117.021 120.349 117.035 120.348 117.049C119.739 118.865 119.279 120.726 118.971 122.616C118.971 122.71 118.944 122.805 118.935 122.899C118.933 122.935 118.933 122.972 118.935 123.007C118.935 123.103 118.926 123.198 118.908 123.291C118.857 123.801 118.837 124.313 118.849 124.825C118.867 124.983 118.872 125.149 118.885 125.311Z"
                        fill="#37474F"
                      />
                      <path
                        d="M133.753 90.738C134.928 96.336 142.209 111.726 146.718 114.876C149.346 116.712 165.78 123.8 166.761 122.036C167.661 120.393 167.413 107.739 167.413 107.739C163.566 106.601 152.878 103.554 151.663 103.347C150.795 103.203 144.913 96.0795 138.613 88.8975C135.117 84.9195 133.051 87.3945 133.753 90.738Z"
                        fill="#D3766A"
                      />
                      <path
                        d="M163.935 105.849L163.013 122.85C163.013 122.85 149.553 118.215 145.588 114.912C141.624 111.609 135.436 98.91 133.618 92.232C131.8 85.554 134.905 84.132 140.368 90.171C144.868 95.121 150.84 102.168 151.655 102.546C152.469 102.924 163.935 105.849 163.935 105.849Z"
                        fill="#455A64"
                      />
                      <path
                        d="M133.618 92.223C135.418 98.901 141.624 111.604 145.588 114.903C147.685 116.658 152.455 118.777 156.474 120.388L156.582 120.429L133.969 86.85C133.856 86.854 133.743 86.8676 133.632 86.8905C132.952 87.75 132.894 89.55 133.618 92.223Z"
                        fill="#263238"
                      />
                      <path
                        d="M159.408 120.622C159.664 118.219 160.344 108.36 160.348 106.223C160.348 106.074 160.254 106.038 160.236 106.191C159.3 113.369 159.444 118.247 159.313 120.591C159.3 120.668 159.403 120.681 159.408 120.622Z"
                        fill="#263238"
                      />
                      <path
                        d="M115.011 124.789C115.087 124.87 146.403 124.821 146.686 124.497C147.082 124.047 139.333 91.7055 137.173 86.886C136.251 84.8295 131.229 84.186 129.114 85.95C123.809 90.3105 119.322 105.246 118.287 109.746C116.577 117.162 114.75 124.497 115.011 124.789Z"
                        fill="#455A64"
                      />
                      <path
                        d="M137.331 87.408H137.308C137.398 88.83 137.515 92.124 135.283 91.908C134.387 91.7517 133.554 91.3409 132.885 90.7245C132.187 90.1544 131.552 89.5118 130.99 88.8075C130.335 88.039 129.745 87.2172 129.226 86.3505C129.204 86.31 129.15 86.3505 129.172 86.3865C129.699 87.255 130.144 88.155 130.756 88.974C131.338 89.77 132.025 90.483 132.799 91.0935C133.533 91.656 134.406 92.214 135.355 92.2545C135.769 92.2737 136.176 92.15 136.509 91.9041C136.842 91.6582 137.08 91.3052 137.182 90.9045C137.491 89.7645 137.542 88.57 137.331 87.408Z"
                        fill="#263238"
                      />
                      <path
                        d="M135.4 90.414C133.798 90.576 131.13 87.6015 130.333 85.536C130.279 85.392 130.666 84.0285 131.062 82.35C131.296 81.3285 131.512 80.1855 131.674 79.128L138.091 81.6255C137.536 82.8965 137.138 84.231 136.908 85.599C136.894 85.7487 136.894 85.8993 136.908 86.049C136.91 86.0729 136.91 86.097 136.908 86.121C136.921 86.9535 136.953 90.2565 135.4 90.414Z"
                        fill="#D3766A"
                      />
                      <path
                        d="M136.21 86.058C136.437 86.0949 136.665 86.1129 136.894 86.112C136.894 86.0805 136.894 86.058 136.894 86.04C136.881 85.8903 136.881 85.7397 136.894 85.59C137.124 84.2224 137.52 82.888 138.073 81.6165L131.877 79.2C131.953 80.7525 132.493 85.5 136.21 86.058Z"
                        fill="#263238"
                      />
                      <path
                        d="M130.023 73.044C129.618 75.492 131.765 82.1205 133.623 83.394C136.323 85.266 140.337 84.9465 141.818 81.7875C143.249 78.7185 140.301 70.1325 138.249 69.003C135.243 67.3605 130.622 69.4305 130.023 73.044Z"
                        fill="#D3766A"
                      />
                      <path
                        d="M137.47 76.473C137.47 76.473 137.439 76.5045 137.448 76.5225C137.605 76.9725 137.709 77.499 137.349 77.7735C137.349 77.7735 137.349 77.805 137.349 77.8005C137.835 77.571 137.7 76.8645 137.47 76.473Z"
                        fill="#263238"
                      />
                      <path
                        d="M136.921 76.131C136.183 76.3065 136.588 77.7645 137.268 77.607C137.947 77.4495 137.538 75.987 136.921 76.131Z"
                        fill="#263238"
                      />
                      <path
                        d="M139.972 75.753C139.972 75.753 140.013 75.753 140.017 75.7845C140.125 76.2345 140.332 76.743 140.782 76.779V76.806C140.265 76.8735 140.004 76.203 139.972 75.753Z"
                        fill="#263238"
                      />
                      <path
                        d="M140.247 75.15C140.958 74.8935 141.417 76.338 140.756 76.5765C140.094 76.815 139.649 75.384 140.247 75.15Z"
                        fill="#263238"
                      />
                      <path
                        d="M136.161 75.6225C136.337 75.5133 136.507 75.3946 136.669 75.267C136.867 75.1275 137.034 75.0375 137.119 74.817C137.137 74.7485 137.132 74.676 137.105 74.6108C137.077 74.5457 137.028 74.4916 136.966 74.457C136.834 74.4068 136.691 74.3924 136.551 74.4153C136.411 74.4382 136.28 74.4976 136.17 74.5875C135.922 74.738 135.739 74.9754 135.657 75.2535C135.643 75.3181 135.648 75.3853 135.672 75.4471C135.695 75.5088 135.736 75.5625 135.789 75.6015C135.843 75.6405 135.906 75.6633 135.972 75.667C136.038 75.6707 136.104 75.6553 136.161 75.6225Z"
                        fill="#263238"
                      />
                      <path
                        d="M140.607 74.277C140.4 74.2882 140.193 74.2882 139.986 74.277C139.767 74.312 139.542 74.274 139.347 74.169C139.294 74.1225 139.257 74.0604 139.242 73.9917C139.227 73.9229 139.233 73.8511 139.262 73.7865C139.339 73.6677 139.448 73.5721 139.575 73.5095C139.703 73.447 139.844 73.4199 139.986 73.431C140.275 73.4089 140.561 73.4938 140.792 73.6695C140.845 73.7122 140.884 73.77 140.904 73.8352C140.924 73.9005 140.925 73.9703 140.905 74.0357C140.885 74.101 140.846 74.1589 140.793 74.202C140.74 74.245 140.675 74.2711 140.607 74.277Z"
                        fill="#263238"
                      />
                      <path
                        d="M137.948 80.7345C138.074 80.8395 138.233 80.8968 138.398 80.8965C138.562 80.8442 138.715 80.7601 138.848 80.649C138.848 80.649 138.879 80.649 138.87 80.649C138.831 80.7554 138.763 80.849 138.674 80.9196C138.585 80.9903 138.479 81.0352 138.366 81.0495C138.27 81.0484 138.176 81.0193 138.096 80.9658C138.016 80.9122 137.954 80.8365 137.916 80.748C137.916 80.748 137.925 80.7255 137.948 80.7345Z"
                        fill="#263238"
                      />
                      <path
                        d="M138.047 79.2495C138.211 79.3974 138.404 79.5094 138.614 79.5784C138.824 79.6474 139.046 79.6718 139.266 79.65C139.458 79.6344 139.648 79.592 139.829 79.524C139.863 79.5132 139.896 79.4997 139.928 79.4835L140.022 79.4385C140.045 79.4278 140.064 79.4095 140.076 79.3866C140.087 79.3637 140.09 79.3375 140.085 79.3125C140.087 79.296 140.087 79.2794 140.085 79.263V79.2225C139.995 78.8715 139.815 78.3495 139.815 78.3495C139.964 78.381 140.693 78.4935 140.63 78.3135C140.157 76.7537 139.526 75.2459 138.749 73.8135C138.722 73.764 138.65 73.8135 138.668 73.845C139.118 75.2895 139.779 76.6485 140.234 78.0885C139.971 78.053 139.704 78.053 139.442 78.0885C139.397 78.1155 139.811 79.0875 139.838 79.2495C139.56 79.3565 139.263 79.4065 138.965 79.3965C138.668 79.3864 138.375 79.3165 138.105 79.191C138.038 79.2 138.011 79.2225 138.047 79.2495Z"
                        fill="#263238"
                      />
                      <path
                        d="M139.572 79.4025C139.45 79.7045 139.251 79.9697 138.996 80.172C138.854 80.2774 138.683 80.3371 138.505 80.343C138.118 80.343 138.019 80.019 138.006 79.7175C138.002 79.556 138.015 79.3945 138.046 79.236C138.525 79.4517 139.059 79.51 139.572 79.4025Z"
                        fill="#263238"
                      />
                      <path
                        d="M138.996 80.172C138.854 80.2774 138.683 80.3371 138.505 80.343C138.118 80.343 138.019 80.019 138.006 79.7175C138.198 79.6746 138.399 79.6959 138.578 79.7779C138.756 79.86 138.903 79.9984 138.996 80.172Z"
                        fill="#FF98B9"
                      />
                      <path
                        opacity="0.2"
                        d="M130.815 78.1605C131.233 77.8005 131.715 76.0545 131.971 75.33C132.228 74.6055 131.427 71.55 131.17 70.65C131.092 70.7372 131.018 70.8289 130.95 70.9245C130.877 71.0165 130.809 71.1127 130.747 71.2125C130.613 71.4139 130.496 71.6261 130.396 71.847C130.22 72.2357 130.094 72.6456 130.023 73.0665C129.838 74.1735 130.189 76.1895 130.815 78.1605Z"
                        fill="#263238"
                      />
                      <path
                        d="M137.7 71.433C137.533 71.8136 137.271 72.1451 136.939 72.3956C136.608 72.6462 136.217 72.8074 135.805 72.864C135.387 72.9217 134.961 72.8719 134.567 72.7191C134.174 72.5664 133.825 72.3158 133.555 71.991C133.555 71.991 133.506 71.991 133.524 72.018C133.778 72.3868 134.129 72.679 134.537 72.863C134.946 73.047 135.397 73.1158 135.841 73.062C136.276 72.9868 136.683 72.7989 137.022 72.5169C137.36 72.235 137.619 71.8689 137.772 71.4555C137.775 71.4459 137.774 71.4356 137.769 71.4267C137.765 71.4179 137.757 71.4112 137.747 71.4082C137.738 71.4053 137.727 71.4062 137.718 71.4108C137.71 71.4155 137.703 71.4234 137.7 71.433Z"
                        fill="#263238"
                      />
                      <path
                        d="M133.564 66.3885C132.948 66.5747 132.388 66.913 131.937 67.3723C131.486 67.8315 131.157 68.3969 130.981 69.0165C130.856 69.6281 130.947 70.2642 131.238 70.8165C131.238 70.8165 131.296 70.8165 131.287 70.794C131.102 70.2858 131.056 69.737 131.155 69.205C131.254 68.673 131.494 68.1774 131.85 67.77C132.234 67.3143 132.718 66.9532 133.265 66.7144C133.811 66.4757 134.404 66.3657 135 66.393C135.579 66.4138 136.132 66.6385 136.561 67.0275C136.606 67.068 136.696 67.0275 136.66 66.9645C136.071 66.2265 134.784 65.9925 133.564 66.3885Z"
                        fill="#263238"
                      />
                      <path
                        d="M142.317 66.9645C141.895 66.3623 141.273 65.9288 140.562 65.7405C139.576 65.475 138.658 65.835 137.754 66.1905C137.727 66.1905 137.754 66.2355 137.754 66.2265C138.499 65.8464 139.338 65.6901 140.17 65.7765C140.87 65.8994 141.506 66.2602 141.97 66.798C142.423 67.3559 142.66 68.0579 142.637 68.7759C142.615 69.4938 142.335 70.1798 141.849 70.7085C141.561 71.0062 141.216 71.2418 140.833 71.4004C140.451 71.5591 140.04 71.6376 139.626 71.631C139.594 71.631 139.585 71.6805 139.626 71.6805C140.192 71.7116 140.756 71.5841 141.254 71.3124C141.752 71.0407 142.165 70.6355 142.445 70.1424C142.726 69.6492 142.863 69.0877 142.842 68.5207C142.821 67.9538 142.642 67.404 142.326 66.933L142.317 66.9645Z"
                        fill="#263238"
                      />
                      <path
                        d="M129.978 74.6685C129.978 74.6685 127.976 72.621 128.628 70.8975C129.002 69.921 131.058 69.4305 131.058 69.4305C131.207 68.9502 131.449 68.5041 131.771 68.118C132.094 67.7318 132.489 67.4132 132.935 67.1805C134.514 66.2805 136.823 66.69 136.823 66.69C136.823 66.69 138.173 65.295 139.923 65.7135C142.376 66.294 143.073 69.5745 141.246 71.226C139.973 72.387 137.565 71.676 137.565 71.676C137.381 71.7615 135.765 73.5435 133.722 72.2115C133.722 72.2115 132.822 73.656 131.499 73.2195C131.424 73.5873 131.237 73.9233 130.966 74.1823C130.694 74.4413 130.349 74.611 129.978 74.6685Z"
                        fill="#263238"
                      />
                      <path
                        d="M132.21 78.3855C132.21 78.3855 130.342 76.4325 129.433 77.13C128.524 77.8275 130.162 80.829 131.395 81.081C131.553 81.1245 131.717 81.1356 131.879 81.1134C132.041 81.0913 132.196 81.0364 132.336 80.9522C132.476 80.868 132.597 80.7562 132.692 80.6236C132.787 80.491 132.854 80.3404 132.889 80.181L132.21 78.3855Z"
                        fill="#D3766A"
                      />
                      <path
                        d="M129.924 77.9805C129.924 77.9805 129.924 78.0075 129.924 78.012C130.792 78.2145 131.341 78.912 131.76 79.65C131.701 79.5751 131.626 79.514 131.54 79.471C131.455 79.428 131.361 79.4042 131.266 79.4012C131.17 79.3982 131.075 79.4161 130.987 79.4536C130.899 79.4912 130.82 79.5474 130.756 79.6185C130.754 79.6203 130.752 79.6225 130.75 79.6252C130.748 79.6279 130.747 79.6308 130.746 79.634C130.745 79.6371 130.745 79.6403 130.746 79.6435C130.747 79.6466 130.748 79.6496 130.75 79.6522C130.751 79.6549 130.754 79.6572 130.756 79.659C130.759 79.6607 130.762 79.662 130.765 79.6626C130.768 79.6632 130.772 79.6632 130.775 79.6626C130.778 79.662 130.781 79.6608 130.783 79.659C130.92 79.5917 131.075 79.5686 131.226 79.5928C131.376 79.6169 131.516 79.6872 131.625 79.794C131.808 79.9718 131.971 80.1695 132.111 80.3835C132.16 80.451 132.286 80.3835 132.246 80.3115C132.097 79.245 131.062 77.913 129.924 77.9805Z"
                        fill="#263238"
                      />
                      <path
                        d="M169.61 109.35C169.597 112.587 168.626 115.748 166.818 118.433C165.01 121.118 162.447 123.207 159.452 124.436C156.457 125.665 153.166 125.979 149.993 125.338C146.82 124.698 143.908 123.131 141.625 120.836C139.342 118.541 137.79 115.621 137.166 112.445C136.542 109.268 136.873 105.978 138.118 102.99C139.362 100.002 141.465 97.4499 144.159 95.656C146.854 93.8621 150.019 92.9071 153.257 92.9115C155.41 92.9156 157.542 93.3442 159.529 94.1729C161.517 95.0015 163.322 96.2139 164.841 97.7406C166.36 99.2674 167.563 101.079 168.381 103.071C169.199 105.063 169.617 107.196 169.61 109.35Z"
                        fill="#00FFB2"
                      />
                      <g opacity="0.1">
                        <path
                          d="M168.372 107.865C168.132 105.331 167.26 102.899 165.837 100.789C164.414 98.6795 162.484 96.9606 160.224 95.7895C157.965 94.6184 155.448 94.0325 152.904 94.0855C150.36 94.1386 147.869 94.8288 145.661 96.093C145.476 96.201 145.296 96.309 145.116 96.426C144.007 97.1239 142.995 97.9651 142.106 98.928C141.737 99.3175 141.392 99.7277 141.071 100.156C140.225 101.279 139.542 102.515 139.041 103.828C138.929 104.116 138.825 104.409 138.735 104.728C137.709 107.998 137.81 111.518 139.023 114.723C139.131 115.002 139.244 115.276 139.365 115.542C139.778 116.46 140.281 117.334 140.868 118.152C141.18 118.588 141.517 119.005 141.876 119.403C142.718 120.351 143.677 121.188 144.729 121.896C145.283 122.272 145.862 122.611 146.462 122.908C148.559 123.95 150.869 124.492 153.212 124.492C153.473 124.492 153.734 124.492 153.995 124.492H154.094C156.62 124.358 159.071 123.584 161.217 122.242C161.559 122.035 161.892 121.792 162.212 121.572C162.531 121.351 162.815 121.122 163.112 120.865L163.31 120.694L163.517 120.505C163.71 120.33 163.899 120.145 164.079 119.961C165.09 118.935 165.95 117.77 166.631 116.5C166.712 116.352 166.788 116.199 166.865 116.05C167.063 115.65 167.243 115.24 167.409 114.822C167.678 114.125 167.895 113.409 168.057 112.68C168.102 112.505 168.138 112.328 168.165 112.149C168.338 111.24 168.427 110.316 168.431 109.39C168.437 108.859 168.417 108.351 168.372 107.865ZM161.361 98.325C161.903 98.7241 162.413 99.165 162.887 99.6435C162.918 99.6701 162.947 99.7003 162.972 99.7335C165.053 101.858 166.387 104.601 166.775 107.55L166.802 107.806C166.866 108.404 166.892 109.005 166.878 109.606C166.858 110.408 166.766 111.206 166.604 111.991C166.572 112.171 166.532 112.347 166.487 112.522C166.208 113.691 165.77 114.816 165.186 115.866C165.139 115.964 165.085 116.059 165.024 116.149C164.517 117.017 163.913 117.825 163.224 118.557C162.984 118.822 162.73 119.075 162.464 119.313C161.808 119.926 161.09 120.469 160.322 120.933C160.216 121.003 160.106 121.068 159.993 121.126C159.764 121.266 159.543 121.392 159.287 121.509L159.093 121.603C158.495 121.893 157.875 122.135 157.239 122.328H157.208H157.145C155.73 122.753 154.256 122.949 152.78 122.908C152.501 122.908 152.222 122.886 151.947 122.859H151.875C151.668 122.859 151.461 122.818 151.254 122.787C151.16 122.779 151.067 122.764 150.975 122.742C148.647 122.359 146.46 121.37 144.635 119.875C144.432 119.713 144.234 119.542 144.041 119.358C143.96 119.29 143.879 119.218 143.802 119.142C143.254 118.619 142.753 118.05 142.304 117.441C142.018 117.069 141.754 116.681 141.512 116.28L141.404 116.095C141.3 115.915 141.197 115.731 141.102 115.542C140.909 115.177 140.738 114.804 140.58 114.421C139.875 112.692 139.536 110.835 139.586 108.967C139.604 108.238 139.682 107.511 139.82 106.794C139.883 106.447 139.959 106.105 140.049 105.772C140.387 104.513 140.903 103.308 141.584 102.195C141.994 101.516 142.467 100.878 142.997 100.287C143.903 99.2474 144.966 98.3548 146.147 97.641C146.336 97.524 146.529 97.416 146.723 97.3125C148.985 96.0874 151.547 95.5257 154.114 95.6921C156.682 95.8585 159.15 96.7461 161.235 98.253C161.279 98.2733 161.321 98.2974 161.361 98.325Z"
                          fill="black"
                        />
                        <path
                          d="M159.71 111.172C159.572 110.74 159.344 110.342 159.04 110.004C158.737 109.667 158.365 109.398 157.95 109.215C157.73 109.107 157.5 109.021 157.244 108.913C157.437 108.814 157.604 108.738 157.766 108.652C158.1 108.492 158.393 108.257 158.623 107.965C158.852 107.673 159.012 107.333 159.089 106.97C159.144 106.672 159.181 106.371 159.201 106.07C159.221 105.839 159.221 105.607 159.201 105.376C159.181 105.105 159.127 104.838 159.039 104.58C158.875 104.117 158.6 103.702 158.238 103.369C157.877 103.037 157.439 102.797 156.965 102.672C156.336 102.495 155.693 102.371 155.043 102.303C154.823 102.271 154.742 102.217 154.746 101.988C154.746 101.38 154.746 100.768 154.746 100.161V99.711H153.18V102.235H152.028V99.711H150.476V102.271H146.61V104.89H147.749V113.917H146.601V116.55H150.485V118.863H152.051V116.55C152.375 116.55 152.667 116.55 152.951 116.55C153.01 116.542 153.071 116.554 153.122 116.586C153.148 116.613 153.168 116.646 153.179 116.682C153.19 116.718 153.192 116.756 153.185 116.793V116.941C153.185 117.319 153.185 117.707 153.185 118.089V118.881H154.535C154.652 118.881 154.701 118.831 154.719 118.741C154.722 118.71 154.722 118.678 154.719 118.647C154.719 118.327 154.719 118.008 154.719 117.688C154.719 117.369 154.719 117.126 154.719 116.847C154.719 116.568 154.8 116.541 155.034 116.532H155.183C156.123 116.517 157.053 116.32 157.919 115.952C158.604 115.653 159.161 115.12 159.489 114.448C159.534 114.354 159.579 114.259 159.615 114.16C159.825 113.557 159.913 112.918 159.876 112.279C159.873 111.904 159.817 111.532 159.71 111.172ZM152.199 113.917C152.042 113.917 151.965 113.863 151.965 113.67V113.571C151.965 112.558 151.965 111.555 151.965 110.542C151.965 110.376 152.019 110.308 152.19 110.317C152.447 110.317 152.708 110.317 152.964 110.317H153.491C153.844 110.31 154.194 110.397 154.503 110.569C154.52 110.574 154.536 110.583 154.548 110.596L154.688 110.691C154.941 110.901 155.13 111.179 155.233 111.491C155.337 111.804 155.35 112.14 155.273 112.459C155.221 112.867 155.02 113.241 154.708 113.508C154.396 113.775 153.996 113.916 153.585 113.904C153.135 113.904 152.685 113.904 152.235 113.904L152.199 113.917ZM151.965 105.16C151.965 104.994 152.019 104.931 152.19 104.935C152.541 104.935 152.892 104.935 153.243 104.935C153.52 104.929 153.794 105.002 154.031 105.147C154.088 105.182 154.142 105.223 154.193 105.268L154.247 105.322C154.316 105.388 154.375 105.464 154.422 105.547C154.536 105.736 154.603 105.949 154.616 106.168C154.642 106.49 154.624 106.815 154.562 107.132C154.523 107.367 154.404 107.581 154.226 107.739C154.047 107.896 153.819 107.987 153.581 107.995C153.131 108.031 152.681 108.018 152.231 108.032H152.163C152.006 108.032 151.961 107.964 151.961 107.815C151.961 107.365 151.961 106.915 151.961 106.465C151.961 106.015 151.974 105.601 151.965 105.16Z"
                          fill="black"
                        />
                      </g>
                      <path
                        d="M162.9 99.6435C164.201 100.887 165.24 102.379 165.955 104.031C166.664 105.697 167.039 107.486 167.058 109.296C167.076 111.113 166.727 112.914 166.032 114.592C165.345 116.278 164.327 117.808 163.038 119.093C161.75 120.379 160.217 121.393 158.53 122.076C156.852 122.769 155.05 123.115 153.234 123.093C151.423 123.071 149.634 122.693 147.969 121.981C146.321 121.26 144.832 120.219 143.59 118.917C145.515 120.774 147.94 122.028 150.568 122.525C153.196 123.023 155.912 122.741 158.382 121.716C161.663 120.326 164.276 117.718 165.672 114.439C166.702 111.971 166.988 109.256 166.495 106.628C166.003 103.999 164.753 101.572 162.9 99.6435Z"
                        fill="white"
                      />
                      <path
                        opacity="0.1"
                        d="M143.483 118.89C142.183 117.644 141.149 116.149 140.441 114.493C139.734 112.828 139.364 111.038 139.352 109.228C139.345 107.417 139.701 105.622 140.4 103.95C141.094 102.268 142.117 100.742 143.409 99.4603C144.701 98.1791 146.236 97.1689 147.924 96.489C149.608 95.8031 151.412 95.4619 153.23 95.4855C155.039 95.5136 156.825 95.8974 158.486 96.615C160.135 97.3403 161.622 98.3884 162.86 99.6975C160.941 97.8254 158.516 96.5567 155.884 96.048C153.252 95.5394 150.528 95.8131 148.05 96.8355C144.764 98.2096 142.142 100.81 140.742 104.085C139.703 106.55 139.407 109.265 139.892 111.895C140.377 114.526 141.62 116.957 143.469 118.89H143.483Z"
                        fill="black"
                      />
                      <path
                        d="M146.606 104.886C146.606 104.67 146.579 104.436 146.57 104.233C146.561 104.031 146.57 103.783 146.57 103.576L146.534 102.267V102.177H146.628C147.915 102.153 149.204 102.153 150.494 102.177L150.399 102.267L150.435 100.989L150.462 100.345C150.462 100.134 150.462 99.9225 150.494 99.7065C150.494 99.9225 150.516 100.156 150.525 100.345L150.548 100.989L150.584 102.267V102.357H150.494C149.201 102.378 147.912 102.378 146.628 102.357L146.718 102.267L146.682 103.576C146.682 103.797 146.682 104.026 146.66 104.233C146.637 104.44 146.619 104.67 146.606 104.886Z"
                        fill="white"
                      />
                      <path
                        d="M146.597 116.55C146.597 116.1 146.565 115.677 146.552 115.236C146.538 114.795 146.552 114.358 146.525 113.922V113.85H146.601H147.749L147.654 113.944V111.694C147.654 110.943 147.654 110.191 147.654 109.444C147.654 108.697 147.654 107.941 147.686 107.194C147.717 106.447 147.722 105.687 147.753 104.944C147.78 105.696 147.803 106.452 147.816 107.194C147.83 107.937 147.848 108.697 147.848 109.444C147.848 110.191 147.848 110.947 147.848 111.694V113.944V114.034H147.758H146.61L146.682 113.962C146.682 114.412 146.682 114.862 146.651 115.276C146.619 115.69 146.615 116.1 146.597 116.55Z"
                        fill="white"
                      />
                      <path
                        d="M152.226 113.917C152.478 113.89 152.725 113.881 152.977 113.863L153.724 113.832C153.959 113.814 154.186 113.744 154.39 113.628C154.594 113.511 154.77 113.35 154.903 113.157C155.164 112.758 155.266 112.277 155.191 111.807C155.163 111.566 155.087 111.334 154.966 111.123C154.847 110.908 154.685 110.719 154.489 110.569C154.715 110.694 154.91 110.867 155.059 111.076C155.209 111.286 155.309 111.526 155.353 111.78C155.412 112.037 155.417 112.303 155.37 112.562C155.323 112.821 155.224 113.068 155.079 113.287C154.927 113.505 154.725 113.683 154.49 113.808C154.255 113.932 153.995 113.999 153.729 114.003C153.225 113.98 152.725 113.962 152.226 113.917Z"
                        fill="white"
                      />
                      <path
                        d="M152.226 108.036C152.635 107.991 153.058 107.968 153.454 107.946C153.644 107.916 153.823 107.843 153.98 107.732C154.136 107.622 154.264 107.476 154.354 107.307C154.528 106.956 154.584 106.559 154.516 106.173C154.454 105.773 154.274 105.4 153.999 105.102C154.344 105.354 154.586 105.724 154.678 106.141C154.789 106.567 154.739 107.019 154.539 107.41C154.434 107.607 154.282 107.774 154.097 107.897C153.911 108.02 153.698 108.096 153.477 108.117C153.045 108.112 152.64 108.076 152.226 108.036Z"
                        fill="white"
                      />
                      <path
                        d="M150.48 116.55C150.624 117.314 150.624 118.099 150.48 118.863C150.336 118.099 150.336 117.314 150.48 116.55Z"
                        fill="white"
                      />
                      <path
                        d="M153.126 116.572C153.27 117.332 153.27 118.112 153.126 118.872C153.048 118.493 153.011 118.107 153.018 117.72C153.014 117.335 153.05 116.95 153.126 116.572Z"
                        fill="white"
                      />
                      <path
                        d="M169.983 103.752C171.225 105.678 174.006 107.901 174.424 109.552C174.543 109.955 174.528 110.384 174.383 110.777C174.238 111.17 173.97 111.506 173.619 111.735C173.619 111.735 175.397 112.351 175.532 113.908C175.599 114.714 174.38 115.528 174.38 115.528C174.38 115.528 175.783 116.082 175.819 117.477C175.846 118.584 174.618 119.236 174.618 119.236C174.618 119.236 175.716 120.397 175.383 121.536C174.703 123.849 165.249 125.082 163.332 121.792C162.432 120.258 164.767 120.082 164.767 120.082C164.767 120.082 161.361 119.524 161.055 117.585C160.749 115.645 163.786 115.596 163.786 115.596C163.786 115.596 160.492 115.029 160.38 112.981C160.263 110.853 163.309 111.325 163.309 111.325C163.309 111.325 161.019 110.178 161.293 108.589C161.743 105.97 166.923 108.504 168.943 107.739L168.682 104.341L169.983 103.752Z"
                        fill="#D3766A"
                      />
                      <path
                        d="M172.062 106.501C171.045 104.575 172.39 103.513 171.963 101.457C171.481 99.171 168.813 100.134 168.664 104.224L168.934 107.739L172.062 106.501Z"
                        fill="#D3766A"
                      />
                      <path
                        d="M174.438 119.367C174.47 119.367 174.488 119.403 174.438 119.416C171.312 120.635 167.889 120.875 164.624 120.105C164.52 120.078 164.52 119.898 164.624 119.907C167.904 120.206 171.21 120.024 174.438 119.367Z"
                        fill="#263238"
                      />
                      <path
                        d="M174.429 115.542C174.465 115.542 174.479 115.591 174.429 115.605C171.32 116.788 167.18 117.076 163.674 115.695C163.553 115.645 163.494 115.484 163.634 115.529C166.05 116.271 171.419 116.199 174.429 115.542Z"
                        fill="#263238"
                      />
                      <path
                        d="M163.084 111.15C166.495 112.347 169.951 112.324 173.493 111.793C173.538 111.793 173.542 111.852 173.493 111.87C171.832 112.603 169.537 112.702 167.746 112.635C166.083 112.602 164.456 112.137 163.026 111.285C162.985 111.231 163.012 111.118 163.084 111.15Z"
                        fill="#263238"
                      />
                      <path
                        d="M125.1 89.7435C119.538 96.4935 110.25 114.313 112.644 116.986C118.071 123.057 127.993 128.646 131.971 130.135C133.69 130.774 140.818 118.458 139.234 117.301C137.335 115.911 124.965 110.07 124.947 109.453C124.929 108.837 127.881 100.215 129.123 93.393C130.684 84.9195 127.44 86.931 125.1 89.7435Z"
                        fill="#D3766A"
                      />
                      <path
                        d="M132.926 115.978C132.926 115.978 138.371 114.772 141.971 114.147C143.978 113.8 147.474 113.512 149.067 113.931C151.448 114.556 161.006 118.701 160.052 121.041C159.188 123.156 151.43 118.552 151.43 118.552C151.43 118.552 159.669 122.508 158.157 124.852C156.645 127.197 148.572 120.843 148.572 120.843C148.572 120.843 156.951 125.095 155.007 127.278C153.54 128.929 145.904 123.579 145.904 123.579C145.904 123.579 153.077 127.282 151.641 129.046C150.053 130.995 142.695 126.495 142.695 126.495C138.29 130.36 134.672 130.675 131.99 130.122C131.364 130.005 132.926 115.978 132.926 115.978Z"
                        fill="#D3766A"
                      />
                      <path
                        d="M149.049 117.202C155.349 119.65 157.675 122.778 157.599 122.71C155.736 121.045 152.388 119.146 151.443 118.633C150.498 118.12 149.967 117.756 149.026 117.238C149.004 117.225 149.026 117.193 149.049 117.202Z"
                        fill="#263238"
                      />
                      <path
                        d="M146.74 120.379C149.331 121.252 151.745 122.581 153.868 124.303C153.945 124.375 153.9 124.389 153.805 124.335C152.626 123.646 147.933 121.032 146.727 120.406L146.74 120.379Z"
                        fill="#263238"
                      />
                      <path
                        d="M144.571 122.976C146.565 123.694 148.406 124.781 149.998 126.18C150.079 126.243 149.998 126.265 149.913 126.211C148.113 125.113 146.736 124.236 144.544 123.061C144.508 123.025 144.531 122.958 144.571 122.976Z"
                        fill="#263238"
                      />
                      <path
                        d="M135.648 114.777L127.264 128.893C127.264 128.893 112.104 119.088 111.892 115.551C111.591 110.569 122.116 92.7855 125.217 89.3115C128.245 85.9275 130.329 86.337 129.64 91.1925C129.019 95.607 125.59 108.913 125.626 109.107C125.662 109.3 135.648 114.777 135.648 114.777Z"
                        fill="#455A64"
                      />
                      <path
                        d="M124.888 126.252C126.189 124.218 131.188 115.699 132.165 113.787C132.232 113.652 132.165 113.58 132.075 113.71C128.025 119.709 125.982 124.137 124.812 126.198C124.78 126.247 124.857 126.301 124.888 126.252Z"
                        fill="#263238"
                      />
                      <path
                        d="M128.934 94.923C128.934 94.8645 129.051 94.8825 129.042 94.923C128.947 95.526 128.767 96.417 128.547 97.461C128.574 97.407 128.596 97.3485 128.623 97.29C128.799 96.84 128.956 96.4215 129.073 95.9715C129.075 95.9668 129.077 95.9624 129.08 95.9586C129.084 95.9548 129.088 95.9516 129.092 95.9493C129.096 95.947 129.101 95.9456 129.106 95.9452C129.111 95.9447 129.116 95.9453 129.121 95.9467C129.125 95.9482 129.13 95.9506 129.134 95.9538C129.137 95.957 129.141 95.9608 129.143 95.9652C129.145 95.9696 129.147 95.9744 129.147 95.9793C129.147 95.9843 129.147 95.9893 129.145 95.994C129.015 96.444 128.875 96.894 128.718 97.344C128.619 97.6514 128.5 97.952 128.362 98.244C127.417 102.595 125.914 108.837 125.941 108.99C125.982 109.246 134.041 113.661 135.702 114.669C135.76 114.705 135.463 115.119 135.432 115.186C135.429 115.198 135.421 115.209 135.411 115.215C135.4 115.221 135.388 115.223 135.376 115.22C135.364 115.217 135.354 115.21 135.347 115.199C135.341 115.189 135.339 115.176 135.342 115.164C135.375 115.04 135.418 114.92 135.472 114.804C133.911 114.021 125.653 109.44 125.505 109.188C125.356 108.936 128.434 96.786 128.934 94.923Z"
                        fill="#263238"
                      />
                      <path
                        d="M115.807 120.424C116.293 120.717 120.82 124.411 121.306 124.753C121.311 124.756 121.314 124.76 121.317 124.764C121.32 124.768 121.322 124.772 121.323 124.777C121.324 124.782 121.324 124.787 121.323 124.792C121.322 124.796 121.32 124.801 121.318 124.805C121.315 124.809 121.312 124.813 121.308 124.816C121.303 124.819 121.299 124.821 121.294 124.822C121.289 124.823 121.284 124.823 121.28 124.822C121.275 124.821 121.27 124.819 121.266 124.816C119.376 123.867 116.23 121.158 115.78 120.46C115.767 120.438 115.785 120.411 115.807 120.424Z"
                        fill="#263238"
                      />
                    </svg>
                    <span
                      className="absolute top-4 right-4 cursor-pointer"
                      onClick={closeModal}
                    >
                      &times;
                    </span>
                    <div className="tile col-start-2">
                      <h1 className="text-2xl font-bold ml-4">
                        Settlement Feature
                      </h1>
                      <br />
                      <ul
                        className="mt-2 ml-4 pb-4"
                        style={{ listStyleType: "none" }}
                      >
                        <li className="mb-2 flex items-start">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 mt-1"
                          >
                            <circle cx="6" cy="6" r="6" fill="#00FFB2" />
                          </svg>
                          Settlement Options: After the cross-chain swap, you
                          can choose where to settle the swapped funds.
                        </li>
                        <li className="mb-2 flex items-start">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 mt-1"
                          >
                            <circle cx="6" cy="6" r="6" fill="#00FFB2" />
                          </svg>
                          Zeta Chain Settlement: Offers faster transactions and
                          seamless integration with the Zeta Chain ecosystem.
                        </li>
                        <li className="mb-2 flex items-start">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 mt-1"
                          >
                            <circle cx="6" cy="6" r="6" fill="#00FFB2" />
                          </svg>
                          Parent Chain Settlement: Ensures compatibility with
                          existing assets and provides wider accessibility.
                        </li>
                        <li className="mb-2 flex items-start">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 mt-1"
                          >
                            <circle cx="6" cy="6" r="6" fill="#00FFB2" />
                          </svg>
                          Consider your preferences and requirements to select
                          the appropriate settlement option.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {modalFundsOpen && (
              <div className="fixed flex inset-0 items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-black bg-opacity-20 absolute inset-0"></div>
                <div className="p-4 rounded-lg shadow-lg border border-gray-300 text-white bg-opacity-80 max-w-[500px] backdrop-filter backdrop-blur-sm">
                  <div className="grid mt-6 grid-cols-2 items-center justify-content">
                    <span
                      className="absolute top-4 right-4 cursor-pointer"
                      onClick={closeFundsModal}
                    >
                      &times;
                    </span>
                    <div className="tile col-start-1 col-span-2">
                      <h1 className="text-2xl text-red-500 font-bold ml-4">
                        Insufficient Funds
                      </h1>
                      <br />
                      <div className="w-15/16 ml-2 mx-auto">
                        <div className="bg-gray-200 dark:bg-gray-700 h-1 w-full flex items-center justify-between">
                          <div className="w-1/3 bg-[#00FFB2] h-1 flex items-center">
                            <div className="bg-[#00FFB2] h-6 w-6 rounded-full shadow flex items-center justify-center">
                              <img
                                src="https://tuk-cdn.s3.amazonaws.com/can-uploader/thin_with_steps-svg1.svg"
                                alt="check"
                              />
                            </div>
                          </div>
                          <div className="w-1/3 flex justify-between bg-[#00FFB2] h-1 items-center relative">
                            <div className="absolute right-0 -mr-2">
                              {/* <div className="relative bg-white dark:bg-gray-800 shadow-lg px-2 py-1 rounded mt-16 -mr-12">
                                        <svg className="absolute top-0 -mt-1 w-full right-0 left-0 text-white dark:text-gray-800" width="16px" height="8px" viewBox="0 0 16 8" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                <g id="Progress-Bars" transform="translate(-322.000000, -198.000000)" fill="currentColor">
                                                    <g id="Group-4" transform="translate(310.000000, 198.000000)">
                                                        <polygon id="Triangle" points="20 0 28 8 12 8"></polygon>
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                        <p tabindex="0" class="focus:outline-none text-indigo-700 dark:text-indigo-400 text-xs font-bold">Step 3: Analyzing</p>
                                    </div> */}
                            </div>
                            <div className="bg-[#00FFB2] h-6 w-6 rounded-full shadow flex items-center justify-center -ml-2">
                              <img
                                src="https://tuk-cdn.s3.amazonaws.com/can-uploader/thin_with_steps-svg1.svg"
                                alt="check"
                              />
                            </div>
                            <div className="bg-white dark:bg-gray-700 h-6 w-6 rounded-full shadow flex items-center justify-center -mr-3 relative">
                              <div className="h-3 w-3 bg-[#00FFB2] rounded-full"></div>
                            </div>
                          </div>
                          <div className="w-1/3 flex justify-end">
                            <div className="bg-white dark:bg-gray-700 h-6 w-6 rounded-full shadow"></div>
                          </div>
                        </div>
                      </div>
                      <br />
                      <br />
                      <h1 className="text-lg text-white-500 font-bold ml-4">
                        Switch Network to BSC Chain
                      </h1>
                      <div className="ml-2 mr-2 flex justify-between col-span-2">
                        <div className="w-1/3  col-span-1 md:col-span-5 rounded-md">
                          <InputField
                            name="balance"
                            type="number"
                            className="text-white text-lg"
                            placeholder={"Zeta Chain"}
                            disabled={isDisable}
                          />
                        </div>
                        {/* <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6"><path fill="#1E1E1E" d="M0 0H147V142H0z"/><g filter="url(#a)"><rect x="1" y="1" width="6" height="6" rx="24" fill="#fff" fill-opacity=".1"/><path d="m61 70.2.1-.3c.2-.4.6-.7 1-.8h16.3l-.2-.2-4.8-4.8c-.5-.5-.7-1.1-.3-1.6.4-.5.8-1 1.3-1.3.4-.3 1-.2 1.5.1l.2.2 8.4 8.5c.6.5.7 1.1.3 1.7l-.3.3-8.4 8.5c-.7.7-1.4.7-2 0l-.7-.6c-.6-.6-.6-1.4 0-2l4.8-4.8.2-.2H62.7c-1 0-1.3-.2-1.7-1.1v-1.6Z" fill="#00F5AB"/><rect x=".5" y=".5" width="6" height="6" rx="24.5" stroke="url(#b)"/></g><defs><linearGradient id="b" x1="73" y1="1" x2="73" y2="141" gradientUnits="userSpaceOnUse"><stop stop-color="#A4A4A4"/><stop offset="1" stop-color="#959595" stop-opacity=".2"/></linearGradient><filter id="a" x="-16" y="-16" width="6" height="6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feGaussianBlur in="BackgroundImageFix" stdDeviation="8"/><feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_0_1"/><feBlend in="SourceGraphic" in2="effect1_backgroundBlur_0_1" result="shape"/></filter></defs></svg> */}
                        <div className="w-1/3 col-start-2 col-span-1 md:col-span-5 rounded-md">
                          <InputField
                            name="required"
                            type="number"
                            placeholder="BSC Chain"
                            disabled={isDisable}
                          />
                        </div>
                      </div>
                      <div className="flex ml-4 text-xs content-center text-center">
                        <Button
                          type="submit"
                          className="mt-5 z-50 mb-8 md:grid-cols-50 sm:w-full md:w-full lg:w-[30rem] xl:w-[30rem] justify-center col-start-4 ml-[-1rem]"
                          text={"Switch Network"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default DirectTrade;
