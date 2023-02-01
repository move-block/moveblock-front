import useWallet from '~common/hooks/useWallet';

const CheckAuth = ({
  children,
  unconnected,
}: {
  children: React.ReactElement;
  unconnected: React.ReactElement;
}) => {
  const { connected } = useWallet();

  return connected ? children : unconnected;
};

export default CheckAuth;
