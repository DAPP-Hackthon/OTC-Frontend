import {WagmiConfig,configureChains, createConfig } from 'wagmi'
import { mainnet, polygon,aurora,auroraTestnet, optimism } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { WalletConnectLegacyConnector } from 'wagmi/connectors/walletConnectLegacy'
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect'
 
const connector = new WalletConnectLegacyConnector({
  chains: [mainnet, optimism],
  options: {
    qrcode: true,
  },
})
// const { chains, publicClient } = configureChains(
//   [mainnet,polygon],
//   [
//     alchemyProvider({ apiKey: 'yI64cDClBr57bI5P80LH1-H94gJT4j52' }),
//     // publicProvider()
//   ],
//   { batch: { multicall: true } },
// )
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet,aurora,auroraTestnet, optimism, polygon],
  [
    alchemyProvider({ apiKey: 'yI64cDClBr57bI5P80LH1-H94gJT4j52' }),
    infuraProvider({ apiKey: 'fcadb7e931ce4d35bb893d71dba6f800' }),
    publicProvider(),
  ],
  // { batch: { multicall: true }, retryCount: 5 },
  
)
 
const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: '7bc1a1ed96140bdbf1ea6c09b67296be',
      },
    }),
  ],
  publicClient,
})
interface InitProps {
  children: React.ReactNode;
}

const Init = ({ children }: InitProps) => {
  return (
    <div>
      <WagmiConfig config={config}>
      {children}
      </WagmiConfig>
      {/* <Web3Modal projectId={projectId} ethereumClient={ethereumClient} /> */}
    </div>
  );
};

export default Init;
