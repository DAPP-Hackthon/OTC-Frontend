import { Web3Modal } from '@web3modal/react';
import { WagmiConfig } from 'wagmi';
import { ethereumClient, projectId, wagmiClient } from './wagmi.config';

interface InitProps {
  children: React.ReactNode;
}

const Init = ({ children }: InitProps) => {
  return (
    <div>
      <WagmiConfig config={wagmiClient}>{children}</WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </div>
  );
};

export default Init;
