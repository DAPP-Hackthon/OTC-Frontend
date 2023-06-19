
//   import { configureChains, createClient } from 'wagmi';
//   import { mainnet, sepolia, polygon, optimism } from 'wagmi/chains';
//   import { alchemyProvider } from 'wagmi/providers/alchemy'
//   import { publicProvider } from 'wagmi/providers/public'
//   import { InjectedConnector } from 'wagmi/connectors/injected'
//   import { infuraProvider } from 'wagmi/providers/infura'
//   import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

  
//   const {chains, provider, webSocketProvider } = configureChains(
//     [mainnet,sepolia, polygon, optimism],
//     [
//         alchemyProvider({ apiKey: '5fe14YXCbViiY2bmvhk6auTsTNEFOX_g' }), 
//         infuraProvider({ apiKey: 'fcadb7e931ce4d35bb893d71dba6f800' }),
//         publicProvider(),
//     ],
//   )
  
//   // Set up client
//   const wagmiClient = createClient({
//     autoConnect: true,
//     connectors: [new InjectedConnector({ chains })],
//     provider
//     // webSocketProvider,
//   });
  
  
  
//   export { wagmiClient};
  
