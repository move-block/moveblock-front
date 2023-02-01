import CenterContainer from '~common/components/CenterContainer';
import ConnectWallet from '~common/components/ConnectWallet';

const Unconnected = () => {
  return (
    <CenterContainer className="-mt-16">
      <h1 className="uppercase">Block Stack</h1>
      <h4 className="font-medium mt-0">
        Connect your wallet and make your own block stack
      </h4>
      <ConnectWallet />
    </CenterContainer>
  );
};

export default Unconnected;
