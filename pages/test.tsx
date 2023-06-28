import React, { FormEvent, useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import CardContainer from "@/components/cards/cardContainer1";
import { InputField } from "@/components/forms/inputField";
import { Button } from "@/components/buttons/button";
import Image from "next/image";
import { TradeType } from "@/sampleData/data";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Select } from "@/components/forms/selectField/select";
import axios from "axios";
import { signMessage, signTypedData } from "@wagmi/core";
import Cookies from "universal-cookie";
import ethers from "ethers";
import { useAccount, useNetwork } from "wagmi";
import { getAddress } from "viem";
import { connect, fetchBalance } from "@wagmi/core";

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
  token1: HTMLTextAreaElement;
  token2: HTMLTextAreaElement;
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

const Test = ({ children, className = "", onClick }: CardProps) => {
  const cookies = new Cookies();
  const router = useRouter();
  const { chain, chains } = useNetwork();
  const chainId = chain?.id;
  // console.log("chain",chain, "chains",chains)
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
  const [availableBal, setAvailablebal] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  // const { data, isError, isSuccess, signMessage } = useSignMessage();
  const handleSelectOption = (option: string, value: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    router.push(`/tradeType/${value}`);
  };
  useEffect(() => {
    if (isConnected) {
      setWalletAddress(`0x${address}`);
    }
  }, [isConnected]);

  const getBalance = async () => {
    const wallet = address;
    //   console.log("wallet", wallet);
    if (wallet != null) {
      const balance = await fetchBalance({
        address: wallet,
      });
      setAvailablebal(balance.formatted + " " + balance.symbol);
      // console.log("balance", availableBal);
    }
  };
  getBalance();

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
    { value: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", label: "MATIC" },
  ];
  const assetType1 = [
    { value: "ETH", label: "ETH", address: "" },
    { value: "MATIC", label: "MATIC", address: "" },
    { value: "BTC", label: "BTC", address: "" },
  ];
  const [convertedRate, setConvertRate] = useState(0);
  const convert = async (amount: string, asset1: string, asset2: string) => {
    try {
      const response = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=${asset1}&tsyms=${asset2}`
      );
      const result = response.data[asset2] * Number(amount);
      console.log("convert", result);
      // setConvertRate(result)
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLElement & { name: string }>
  ) => {
    const elements = formRef.current?.elements as CustomElements;
    await convert(
      elements.send.value,
      elements.yourAsset.value,
      elements.partnerAsset.value
    );

    setIsDisable(elements.visibility.value === "1" ? true : false);
    const err = { ...errors };
    err[e.target.name] = null;
    setErrors(err);
  };

  const handleSubmit = async (e: FormEvent<NewCourseFormElements>) => {
    e.preventDefault();
    const { send, receive } = e.currentTarget.elements;

    try {
        
    //   const tokenAmount = ethers.utils.parseUnits(
    //     "<TOKEN_AMOUNT>",
    //     "<TOKEN_DECIMALS>"
    //   );

    //   const transaction = await contract.approve(spenderAddress, tokenAmount);
    //   const provider = new ethers.providers.Web3Provider(
    //     (window as any).ethereum
    //   );

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
      const domain = {
        name: "OTCDesk",
        version: "1",
        chainId: chainId,
        verifyingContract: getAddress(
          "0x5FbDB2315678afecb367f032d93F642f64180aa3"
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

      const message = {
        nonce: BigInt(1),
        maker: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        tokenToSell: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        sellAmount: BigInt(send.value),
        tokenToBuy: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        buyAmount: BigInt(receive.value),
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
      const resultObj = { ...result };
      // console.log(resultObj);
      window.alert("Successfully Created Your Order");
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("selectedOption1", selectedOption1);
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
        {isDisable == false && (
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
        )}

        <div className="md:flex">
          <CardContainer
            balance={availableBal == null ? "Connect Wallet" : availableBal}
            className="flex-1"
          >
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
                {assetType1 && (
                  <Select
                    name="yourAsset"
                    label="Your Asset"
                    options={[
                      {
                        text: "Select an option",
                        value: "",
                      },
                      ...assetType1.map((item) => ({
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
                  disabled={true}
                  placeholder="Amount you will receive"
                  value={convertedRate}
                  // error={formik.errors.receive}
                  // touched={formik.touched.receive}
                  // handleChange={handleChange}
                />
              </div>
              <div className="col-span-1 md:col-span-5 rounded-md">
                {assetType1 && (
                  <Select
                    name="partnerAsset"
                    label="Your partner Asset"
                    options={[
                      {
                        text: "Select an option",
                        value: "",
                      },
                      ...assetType1.map((item) => ({
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

export default Test;