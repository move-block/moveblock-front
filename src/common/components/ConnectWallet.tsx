import { DisconnectOutlined, UnlockFilled } from '@ant-design/icons';
import { Button } from 'antd';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { truncateWalletAddress } from '~common/utils';
import usePetraWallet from '~common/hooks/useWallet';

interface Props {
  responsive?: boolean;
}

const Connect = ({ responsive }: Props) => {
 const { connectPetra } = usePetraWallet();

  return (
    <Button
      type="primary"
      className="flex items-center"
      onClick={() => connectPetra()}
    >
      <UnlockFilled />
      <span className={responsive ? 'max-sm:hidden' : ''}>Connect Wallet</span>
    </Button>
  );
};

const Disconnect = ({ responsive }: Props) => {
  const { disconnect, account } = useWallet();

  return (
    <Button className="flex items-center"
             onClick={() => disconnect()}
    >
      <span className={responsive ? 'max-sm:hidden' : ''}>
        {truncateWalletAddress(account?.address||'')}
      </span>
      <DisconnectOutlined />
    </Button>
  );
};

const ConnectWallet = ({ responsive = false }: Props) => {
  const { connected  } = useWallet();

  return connected ? (
    <Disconnect responsive={responsive} />
  ) : (
    <Connect responsive={responsive} />
  );
};

export default ConnectWallet;
