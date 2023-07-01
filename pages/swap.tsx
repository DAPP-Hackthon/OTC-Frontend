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
import {
  signMessage,
  signTypedData,
  fetchBalance,
  readContract,
} from "@wagmi/core";
import Cookies from "universal-cookie";
import { ethers } from "ethers";
import {
  useAccount,
  useNetwork,
  useContractRead,
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
declare global {
  interface Window {
    ethereum: any;
  }
}
interface CustomElements extends HTMLFormControlsCollection {
  token1: HTMLTextAreaElement;
  token2: HTMLTextAreaElement;
  send: HTMLTextAreaElement;
  // yourAsset: HTMLSelectElement;
  partnerAsset: HTMLSelectElement;
  receive: HTMLSelectElement;
  visibility: HTMLSelectElement;
  // tradeType: HTMLSelectElement;
  settlementChain: HTMLSelectElement;
  // myCustomDropdownButton: HTMLButtonElement;
}

interface NewCourseFormElements extends HTMLFormElement {
  readonly elements: CustomElements;
}
export const directSchema = Yup.object().shape({
  token1: Yup.string().required("Field is required!"),
  token2: Yup.string().required("Field is required!"),
  send: Yup.number().min(0).required().typeError("price must be a number"),
  receive: Yup.number().min(0).required().typeError("price must be a number"),
  visibility: Yup.string().required("Field is required!"),
});

export const directPrivateSchema = Yup.object().shape({
  token1: Yup.string().required("Field is required!"),
  token2: Yup.string().required("Field is required!"),
  send: Yup.number().min(0).required().typeError("price must be a number"),
  receive: Yup.number().min(0).required().typeError("price must be a number"),
  visibility: Yup.string().required("Field is required!"),
  partnerAsset: Yup.string().required("Field is required!"),
});

const DirectTrade = ({ children, className = "", onClick }: CardProps) => {
  const cookies = new Cookies();
  const router = useRouter();
  const { chain, chains } = useNetwork();
  const [availableBal, setAvailablebal] = useState<string | null>(null);
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
  const getBalance = async () => {
    const wallet = address;
    console.log("wallet", wallet);
    if (wallet != null) {
      const balance = await fetchBalance({
        address: wallet,
      });
      setAvailablebal(balance.formatted + " " + balance.symbol);
      console.log("balance", availableBal);
    }
  };
  getBalance();
  const visibility = [
    { value: 0, label: "Public", ref: "0" },
    { value: 1, label: "Private", ref: "1" },
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
  // const generateNonce = () => {
  //   // Generate a random number or string that is unique for each request
  //   // You can use various methods to generate a nonce, such as a timestamp, UUID, or a combination of random characters
  //   const timestamp = Date.now();
  //   const randomString = Math.random().toString(36).substring(2, 15);
  //   const nonce = `${timestamp}-${randomString}`;

  //   return nonce;
  // };
  const generateNonce = async () => {
    const nonce = await axios.get(
      "http://localhost:8000/otc/order/single-chain/nonce"
    );
    console.log("Nonce Response:", nonce);

    return nonce.data;
  };
  const generateSignature = async (
    token1: string,
    token2: string,
    sellAmount: number,
    buyAmount: number
  ) => {
    const providers = new ethers.providers.Web3Provider(window.ethereum);
    const signers = providers.getSigner();

    // // You can now use the signer to interact with the blockchain
    // // For example, you can get the signer's address
    console.log("signers", signers);
    const signerAddress = await signers.getAddress();

    console.log("Signer Address:", signerAddress);

    // Define the provider URL based on the network ID
    const provider = new ethers.providers.JsonRpcProvider(
      `${chain?.rpcUrls.public.http}`
    );
    console.log("providerUrl", provider);

    // const tokenAddress = "0xFCe7187B24FCDc9feFfE428Ec9977240C6F7006D";
    const tokenContract = new ethers.Contract(
      token1,
      [
        "function approve(address spender, uint256 amount) public returns (bool)",
      ],
      signers
    );
    console.log("tokenContract", tokenContract);
    const spenderAddress = signerAddress;
    const amount = ethers.utils.parseEther(`${sellAmount}`);
    const tx = await tokenContract.approve(spenderAddress, amount);
    console.log("tx", tx);
    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log(`Transaction confirmed`);

    const domain = {
      name: "OTCDesk",
      version: "1",
      chainId: chain?.id as any,
      verifyingContract: getAddress(
        "0xDE626c86508A669Fb3EFB741EE7F94E3ACC534eB"
      ),
    };

    // The named list of all type definitions
    const types = {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
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
    const nonce = await generateNonce();
    const message = {
      nonce: BigInt(nonce),
      maker: getAddress(signerAddress),
      tokenToSell: getAddress(token1),
      sellAmount: BigInt(sellAmount),
      tokenToBuy: getAddress(token2),
      buyAmount: BigInt(buyAmount),
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
    console.log("signature", signature);
    return signature;
  };
  // const { data, isError, isLoading } = useContractRead({
  //   address: "0xFDD2583611CC648Dd2a0589A78eb00Ec75b4b615",
  //   abi: [
  //     "function allowance(address owner, address spender) external view returns (uint256)",
  //   ],
  //   functionName: "allowance",
  // })

  const testApi = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      `${chain?.rpcUrls.public.http}`
    );

    const contractAddress = "0xFCe7187B24FCDc9feFfE428Ec9977240C6F7006D";
    const contractAbi = [
      "function allowance(address owner, address spender) external view returns (uint256)",
    ]; // ABI of the contract
    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      provider
    );

    const ownerAddress = "0xF02cf7E5795fe50d0b918fd6829a59E3b01d5DA4";
    const spenderAddress = "0x95d441e6d3b95f78d8ecda10c45ae1d8b6aa9cb2";

    try {
      const allowance = await contract.allowance(ownerAddress, spenderAddress);
      console.log("Allowance:", allowance.toString());
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e: FormEvent<NewCourseFormElements>) => {
    e.preventDefault();
    const { send, receive } = e.currentTarget.elements;

    try {
      const elements = formRef.current?.elements as CustomElements;
      const visibility = elements.visibility.value
     
      const result = await directSchema.validate(
        {
          token1: elements.token1.value,
          token2: elements.token2.value,
          send: send.value,
          receive: receive.value,
          // yourAsset: elements.yourAsset.value,
          // partnerAsset: elements.partnerAsset.value,
          visibility: elements.visibility.value,
          // tradeType: elements.tradeType.value,
        },
        { abortEarly: false }
      );
      // const result = {Number(visibility)=== ?"":""};

      const headers = {
        accept: "*/*",
        Authorization: `Bearer ${accessToken}`,
        // 'Content-Type': 'application/json',
      };
      console.log(result);
      const signature = await generateSignature(
        result.token1,
        result.token2,
        result.send,
        result.receive
      );
      const nonce = await generateNonce();

      const data = {
        nonce: nonce,
        maker: address,
        tokenToSell: elements.token1.value,
        sellAmount: Number(send.value),
        sourceChainId: chain?.id,
        tokenToBuy: elements.token2.value,
        buyAmount: Number(receive.value),
        destinationChainId: chain?.id,
        signature: signature,
        orderType: Number(elements.visibility.value),
      };
      const apiResponse = await axios.post(
        "http://localhost:8000/otc/order/single-chain/create",

        data,
        { headers }
      );
      console.log("Response:", apiResponse.data);
      setErrors({});
      const resultObj = { ...result };
      console.log(resultObj);
      window.alert("Successfully Created Your Order");
      setTimeout(() => {
        router.push("/allTrade");
      }, 2000); // 2000 milliseconds = 2 seconds
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
      <p className="cursor-pointer" onClick={() => testApi()}>
        Test Api
      </p>
      <div className="flex">
        <div className="w-1/2 flex justify-left pr-3">
          <Button
            onClick={() => setSwapActive("Normal Swap")}
            type="submit"
            className="w-full mx-auto"
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
            className="w-full mx-auto"
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
          <div className=" m-auto grid grid-cols-2">
            <div className="mt-[3rem] w-[90%] justify-center">
              <div className="flex self-center justify-between items-center">
                <h1 className="mt-4">
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
              <CardContainer className="mt-6 min-w-full">
                <div className="grid grid-cols-2 md:grid-cols-10 gap-4 justify-start">
                  <div className="col-span-1t md:col-span-5 rounded-md">
                    <label className="text-md mb-3">Type of Trade</label>
                    <div className="text-sm mt-2 z-50 w-full h-[3rem] flex items-center justify-between rounded-2xl  bg-[#004A3D]/50 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none">
                      Direct Trade
                    </div>
                    <div></div>
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
                {!isDisable ? (
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
            </div>
            <div className="w-[90%] mt-[3rem]">
              <CardContainer
                balance={availableBal == null ? "Connect Wallet" : availableBal}
              >
                <div className="mb-[1rem]">
                  <InputField
                    label="Token"
                    name="token1"
                    placeholder="Enter Token Address..."
                    // error=""
                    // value={formik.values.test}
                    // error={formik.errors.test}
                    // touched={formik.touched.test}
                    // handleChange={formik.handleChange}
                  />
                </div>
                <div className="mb-[1rem]">
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
              </CardContainer>
              <div className="self-center flex m-auto">
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
              </div>
              <CardContainer className="tile row-start-4 col-start-2">
                <div className="grid grid-cols-2 md:grid-cols-10 gap-4">
                  <div className="col-span-1 md:col-span-10 rounded-md">
                    <InputField
                      label="Token"
                      name="token2"
                      placeholder="Enter Token Address..."
                      // error=""
                      // value={formik.values.test}
                      // error={formik.errors.test}
                      // touched={formik.touched.test}
                      // handleChange={formik.handleChange}
                    />
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

              <div className="flex m-auto justify-center self-center">
                <Button
                  type="submit"
                  className="mt-5 mb-8 w-[80%] "
                  text={"Create Trade"}
                />
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default DirectTrade;
