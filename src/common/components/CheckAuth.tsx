import useWallet from '~common/hooks/useWallet';

const CheckAuth = ({
  children,
  unconnected,
}: {
  children: React.ReactElement;
  unconnected: React.ReactElement;
}) => {
  const { isConnected } = useWallet();

  return isConnected ? children : unconnected;
};

export default CheckAuth;
