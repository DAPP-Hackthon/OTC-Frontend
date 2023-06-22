import {
    EthereumClient,
    w3mConnectors,
    w3mProvider,
  } from '@web3modal/ethereum';
  import { configureChains, createConfig } from 'wagmi';
  import { mainnet, sepolia, bsc, optimism, arbitrum } from 'wagmi/chains';
  
  const defaultChains = [mainnet, sepolia, bsc,optimism, arbitrum];
  const projectId = '7bc1a1ed96140bdbf1ea6c09b67296be';
  
  const { publicClient, webSocketPublicClient } = configureChains(defaultChains, [
    // alchemyProvider({ apiKey: `${process.env.ALCHEMY_API_KEY}` }),
    w3mProvider({ projectId }),
    // publicProvider(),
  ]);
  
  // Set up client
  const wagmiClient = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({
      version: 1,
      chains: defaultChains,
      projectId,
    }),
    publicClient,
    
    webSocketPublicClient,
  });
  
  const ethereumClient = new EthereumClient(wagmiClient, defaultChains);
  
  export { wagmiClient, ethereumClient, projectId };
  
  // new MetaMaskConnector({
  // 	chains: [mainnet],
  // }),
  // new WalletConnectConnector({
  // 	options: {
  // 		qrcode: true,
  // 	},
  // }),
  // new CoinbaseWalletConnector({
  // 	options: {
  // 		appName: "wagmi.sh",
  // 		jsonRpcUrl:
  // 			"https://eth-mainnet.alchemyapi.io/v2/yourAlchemyId",
  // 	},
  // }),
  