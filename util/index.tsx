// import { Web3Modal } from '@web3modal/react';
// import {
//   EthereumClient,
//   w3mProvider,
//   w3mConnectors,
// } from '@web3modal/ethereum';
// import { WagmiConfig, createClient, configureChains } from 'wagmi';
// // import { ethereumClient, projectId, wagmiClient } from './wagmi.config';
// import { mainnet, polygonMumbai } from "wagmi/chains";

// interface InitProps {
//   children: React.ReactNode;
// }
// const projectId = "7bc1a1ed96140bdbf1ea6c09b67296be";
// const chains = [mainnet, polygonMumbai];
// const { provider } = configureChains(chains, [w3mProvider({ projectId })]);

// const wagmiClient = createClient({
//   autoConnect: true,
//   connectors: w3mConnectors({ version: 1, chains, projectId }),
//   provider,
// });
// const ethereumClient = new EthereumClient(wagmiClient, chains);

// const Init = ({ children }: InitProps) => {
//   return (
//     <div>
//       <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
//       <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
//     </div>
//   );
// };

// export default Init;

import type { AppProps } from "next/app";

import { WagmiConfig, createClient } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

const client = createClient(
  getDefaultClient({
    appName: "ConnectKit Next.js demo",
    //infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    //alchemyId:  process.env.NEXT_PUBLIC_ALCHEMY_ID,
    chains: [mainnet, polygon, optimism, arbitrum],
  })
);
interface InitProps {
  children: React.ReactNode;
}

const Init = ({ children }: InitProps) => {
  return (
    <div>
      <WagmiConfig client={client}>
        <ConnectKitProvider debugMode>{children}</ConnectKitProvider>
      </WagmiConfig>
      {/* <Web3Modal projectId={projectId} ethereumClient={ethereumClient} /> */}
    </div>
  );
};

export default Init;
