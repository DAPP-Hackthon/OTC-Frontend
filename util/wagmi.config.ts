  // const defaultChains = [mainnet, bsc, optimism, arbitrum];
  
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { configureChains, createClient } from "wagmi";
import { mainnet, bsc, optimism, arbitrum } from "wagmi/chains";

const defaultChains = [mainnet, bsc, optimism, arbitrum];
const projectId = "7bc1a1ed96140bdbf1ea6c09b67296be";

const { provider, webSocketProvider } = configureChains(defaultChains, [
	w3mProvider({ projectId }),
]);

// Set up client
const wagmiClient = createClient({
	autoConnect: true,
	connectors: w3mConnectors({
		version: 1,
		chains: defaultChains,
		projectId,
	}),
	provider,
	webSocketProvider,
});

const ethereumClient = new EthereumClient(wagmiClient, defaultChains);

export { wagmiClient, ethereumClient, projectId };