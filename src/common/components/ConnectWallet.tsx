import { DisconnectOutlined, UnlockFilled } from '@ant-design/icons';
import { Button } from 'antd';
import useWallet from '~common/hooks/useWallet';
import { truncateWalletAddress } from '~common/utils';

interface Props {
  responsive?: boolean;
}

const Connect = ({ responsive }: Props) => {
  const { connect } = useWallet();

  return (
    <Button
      type="primary"
      className="flex items-center"
      onClick={() => connect()}
    >
      <UnlockFilled />
      <span className={responsive ? 'max-sm:hidden' : ''}>Connect Wallet</span>
    </Button>
  );
};

const Disconnect = ({ responsive }: Props) => {
  const { disconnect, wallet } = useWallet();

  return (
    <Button className="flex items-center" onClick={() => disconnect()}>
      <span className={responsive ? 'max-sm:hidden' : ''}>
        {truncateWalletAddress(wallet?.address || '')}
      </span>
      <DisconnectOutlined />
    </Button>
  );
};

const ConnectWallet = ({ responsive = false }: Props) => {
  const { isConnected } = useWallet();

  return isConnected ? (
    <Disconnect responsive={responsive} />
  ) : (
    <Connect responsive={responsive} />
  );
};

export default ConnectWallet;
