import { Chain } from 'wagmi'
 
export const zetachain = {
  id: 7001,
  name: 'Zetachain Athens Testnet',
  network: 'Zetachain Athens Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Zetachain Athens Testnet',
    symbol: 'aZeta',
  },
  rpcUrls: {
    public: { http: ['https://zetachain-athens-evm.blockpi.network/v1/rpc/public'] },
    default: { http: ['https://zetachain-athens-evm.blockpi.network/v1/rpc/public'] },
  },
  // blockExplorers: {
  //   etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  //   default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  // },
  // contracts: {
  //   multicall3: {
  //     address: '0xca11bde05977b3631167028862be2a173976ca11',
  //     blockCreated: 11_907_934,
  //   },
  // },
} as const satisfies Chain