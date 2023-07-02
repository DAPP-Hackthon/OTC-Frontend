import { Chain } from "wagmi";

export const zetachainAthens2 = {
  id: 7001,
  name: "Zetachain Athens 2",
  network: "Zetachain Athens 2",
  nativeCurrency: {
    decimals: 18,
    name: "Zetachain Athens 2",
    symbol: "aZETA",
  },
  rpcUrls: {
    public: { http: ["https://rpc.ankr.com/zetachain_evm_testnet"] },
    default: { http: ["https://rpc.ankr.com/zetachain_evm_testnet"] },
  },
} as const satisfies Chain;

export const polygonMumbai = {
  id: 80001,
  name: "Polygon Mumbai",
  network: "Polygon Mumbai",
  nativeCurrency: {
    decimals: 18,
    name: "Polygon Mumbai",
    symbol: "MATIC",
  },
  rpcUrls: {
    public: { http: ["https://polygon-mumbai.gateway.tenderly.co"] },
    default: { http: ["https://polygon-mumbai.gateway.tenderly.co"] },
  },
} as const satisfies Chain;

export const bscTestnet = {
  id: 97,
  name: "Binance Smart Chain Testnet",
  network: "Binance Smart Chain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Binance Smart Chain Testnet",
    symbol: "tBNB",
  },
  rpcUrls: {
    public: { http: ["https://rpc.ankr.com/bsc_testnet_chapel"] },
    default: { http: ["https://rpc.ankr.com/bsc_testnet_chapel"] },
  },
} as const satisfies Chain;

export const goreli = {
  id: 5,
  name: "Görli Ethereum Testnet",
  network: "Görli Ethereum Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Görli Ethereum Testnet",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://rpc.ankr.com/eth_goerli"] },
    default: { http: ["https://rpc.ankr.com/eth_goerli"] },
  },
} as const satisfies Chain;
